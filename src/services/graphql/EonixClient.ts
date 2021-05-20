
import { ApolloClient, MutationOptions, QueryOptions, TypedDocumentNode } from '@apollo/client/core';
import { InMemoryCache, NormalizedCacheObject } from '@apollo/client/cache';
import { uuid } from '../uuid';
import { IGraphQueryUpdate, UpdateType, UUID } from '../../types';
import { io } from 'socket.io-client';

export { QueryOptions } from '@apollo/client/core';

export class EonixClient {

   private _token: string | (() => string);
   private readonly _options: Required<IClientOptions>;
   private readonly _sessionId: string;

   public constructor(token: string | (() => string), options?: IClientOptions) {

      if (!token) { throw new Error('Missing token'); }

      this._token = token;
      this._sessionId = uuid();

      this._options = {
         host: options?.host ?? 'https://eonix.io'
      };

      if (this._options.host.endsWith('/')) { throw new Error('Host should not have a trailing slash'); }

      this.startSocket();

   }

   private get token(): string {
      if (typeof this._token === 'string') { return this._token ?? ''; }
      return this._token() ?? '';
   }

   /** Extract the userId from the token */
   public get tokenUserId(): UUID {
      return this.token as UUID;
   }

   public watchQuery<TVar, TData>(query: QueryOptions<TVar, TData>): ObservableQuery<Readonly<TData>> {
      const query$ = this.apolloClient.watchQuery<TData>(query);
      return {
         subscribe: (callback: (result: TData) => void) => {
            const sub = query$.subscribe(result => {
               const froze = this.removeTypenameAndFreeze(result.data);
               callback(froze);
            });
            return { unsubscribe: () => sub.unsubscribe() };
         },
         asPromise() {
            const prom = new Promise<Readonly<TData>>(r => {
               const sub = this.subscribe(t => {
                  r(t);
                  setTimeout(sub.unsubscribe);
               });
            });
            return prom;
         }
      };
   }

   public async mutate<TVar, TData>(mutation: MutationOptions<TData, TVar>): Promise<void> {
      await this.apolloClient.mutate(mutation);
   }

   private removeTypename<T>(src: T): T {
      if (!src) { return src; }
      const json = JSON.stringify(src, (k, v) => (k === '__typename' ? undefined : v));
      return JSON.parse(json);
   }

   private removeTypenameAndFreeze<T>(src: T): T {
      if (!src) { return src; }
      const t = this.removeTypename(src);
      this.deepFreeze(t);
      return t;
   }

   private deepFreeze(o: any) {
      if (o === null || o === undefined) { return; }
      if (typeof o !== 'object') { return; }

      Object.freeze(o);

      if (Array.isArray(o)) {
         for (const i of o) {
            this.deepFreeze(i);
         }

         return;
      }

      for (const p of Object.getOwnPropertyNames(o)) {
         this.deepFreeze(o[p]);
      }
   }

   //#region ApolloClient

   private _apolloClient: ApolloClient<NormalizedCacheObject> | undefined;
   private get apolloClient(): ApolloClient<NormalizedCacheObject> {

      if (this._apolloClient) { return this._apolloClient; }

      /** Used for type policies to replace an old array with a new array */
      const merge = (_: [], incoming: []) => {
         return incoming;
      };

      const cache = new InMemoryCache({
         possibleTypes: {
            'Input': [
               'BooleanInput', 'TextInput', 'FileInput', 'SelectInput', 'ChecklistInput', 'TaskReferenceInput'
            ],
            'Value': [
               'ScalarValue', 'FileValue', 'ListValue', 'TaskReferenceValue'
            ],
            'Entity': [
               'User'
            ],
            'Workflow': [
               'DealerShoeWorkflow'
            ],
            'DelegateOrPending': [
               'Delegate', 'DelegatePending'
            ]
         },
         typePolicies: {
            Query: {
               fields: {
                  tasksForBoard: { merge },
                  boards: { merge },
                  delegatesForBoard: { merge },
                  uxsForBoard: { merge }
               }
            },
            Delegate: {
               fields: {
                  inputAccess: { merge }
               }
            },
            Schema: {
               fields: {
                  inputs: { merge }
               }
            },
            TaskReferenceInput: {
               fields: {
                  destinationBoardIds: { merge }
               }
            },
            Task: {
               fields: {
                  values: { merge }
               }
            }
         }
      });

      // `readQuery` should return null or undefined if the query is not yet in the
      // cache: https://github.com/apollographql/apollo-feature-requests/issues/1
      // Still open as of 20201013
      (cache as any).originalReadQuery = cache.readQuery;
      cache.readQuery = (...args: any[]): any => {
         try {
            return (cache as any).originalReadQuery(...args);
         } catch (err) {
            return undefined;
         }
      };

      this._apolloClient = new ApolloClient({
         cache,
         uri: `${this._options.host}/api/graphql`,
         headers: {
            authorization: `Bearer ${this.token}`,
            'x-eonix-client-name': 'eonix.io [web]',
            'x-eonix-sid': this._sessionId
         }
      });

      return this._apolloClient;
   }

   //#endregion

   //#region SocketIO

   private readonly _connectionEventSubscriptions: ObservableCallback<boolean>[] = [];
   private _connectionEvents$: Observable<boolean> = {
      subscribe: (cb) => {
         this._connectionEventSubscriptions.push(cb);

         return {
            unsubscribe: () => {
               const i = this._connectionEventSubscriptions.findIndex(c => c === cb);
               this._connectionEventSubscriptions.slice(i, 1);
            }
         };
      }
   }

   /** Get a observable that emits true when a realtime server connection is made and false if it gets dropped */
   public get realtimeConnectionEvents(): Observable<boolean> { return this._connectionEvents$; }

   private startSocket(): void {

      const socket = io(this._options.host.replace(/https?:\/\//i, ''), {
         query: {
            userId: this.tokenUserId,
            token: this.token,
            sessionId: this._sessionId
         }
      });

      socket.on('connect', () => {
         this._connectionEventSubscriptions.forEach(cb => cb(true));
      });

      socket.on('disconnect', () => {
         this._connectionEventSubscriptions.forEach(cb => cb(false));
      });

      socket.on('query-update', (data: IGraphQueryUpdate) => {
         this.processUpdate(data);
      });
   }

   private _refreshQueue: { key: string, name: string, query: TypedDocumentNode, variables?: Record<string, any> }[] = [];

   private async processUpdate(update: IGraphQueryUpdate,): Promise<void> {

      let updateQueries = update.queries;

      if (update.sessionId === this._sessionId) {
         //Normally we'd just exit, but we need to accept functionExecute regardless of session. 

         updateQueries = updateQueries.filter(q => q.name === 'functionExecute' || q.name === 'functionExecutionResultRecords');

      }

      if (!updateQueries.length) { return; }

      //cache.watches[1].value.variables
      const watches = (this.apolloClient.cache as any).watches as Set<any>;
      if (!watches || watches.size === 0) { return; }

      const watchValues = [...watches.values()];

      for (const queryToUpdate of updateQueries) {

         for (const watch of watchValues) {

            const watchQuery = watch.query as TypedDocumentNode;
            const definedQuery = watchQuery.definitions.find(d => {
               if (d.kind !== 'OperationDefinition') { return; }
               if (d.selectionSet.kind !== 'SelectionSet') { return; }
               const isQuery = d.selectionSet.selections.some(s => s.kind === 'Field' && s.name.kind === 'Name' && s.name.value === queryToUpdate.name);
               return isQuery;
            });

            if (!definedQuery) { continue; }

            //if (!deepEquals(watchValues, queryToUpdate.variables)) { continue; }

            if (queryToUpdate.type === UpdateType.Delete) {
               watches.delete(watch);
               continue; //We continue instead of break because there may be other watches for the same query that we want to delete
            }

            const refreshKey = JSON.stringify({ name: queryToUpdate.name, variables: queryToUpdate.variables });
            if (this._refreshQueue.some(x => x.key === refreshKey)) { break; }
            this._refreshQueue.push({ key: refreshKey, name: queryToUpdate.name, query: watchQuery, variables: queryToUpdate.variables });
            break;

         }
      } //queryToUpdate of update.queries

      this.processQueue();
   }

   private _isProcessingUpdateQueue = false;
   private async processQueue() {
      if (!this._refreshQueue.length) { return; }
      if (this._isProcessingUpdateQueue) { return; }
      this._isProcessingUpdateQueue = true;
      try {
         while (this._refreshQueue.length) {
            const { query, variables } = this._refreshQueue.shift()!;
            await this.apolloClient.query({
               query,
               variables,
               fetchPolicy: 'network-only'
            });
         }
      } finally {
         this._isProcessingUpdateQueue = false;
      }
   }

   //#endregion

}

export interface IClientOptions {
   /** An optional Eonix server url to connect to. */
   host?: string;
}

type ObservableCallback<T> = (result: T) => void;

export interface Observable<T> {
   subscribe: (callback: ObservableCallback<T>) => Subscription;
}

export interface ObservableQuery<T> extends Observable<T> {
   asPromise: () => Promise<T>;
}

export interface Subscription {
   unsubscribe: () => void
}