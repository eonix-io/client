import { OperationDefinitionNode } from 'graphql';
import { ISocketClient } from '../..';
import { IObservable } from '../../../types';
import { IGraphMiddleware } from './IGraphMiddleware';
import { IGraphResponse } from './IGraphResponse';
import { IQueryOptions } from './IQueryOptions';
import { nextTick } from './nextTick';

export class GraphCacheMiddleware implements IGraphMiddleware {

   public constructor(readonly options?: Partial<ICacheOptions> | null) {
      if (options?.socketClient) {
         options.socketClient.queryUpdates.subscribe(update => {
            for (const q of update.queries) {
               const key = this.getCacheKey(q.name, q.variables);
               const cache = this._cache.get(key);
               if (!cache) { continue; }
               cache.refresh();
            }
         });
      }
   }

   private _cache = new Map<string, ICacheRef>();

   public intercept<TQuery, TVariables, TQueryOptions extends IQueryOptions<TQuery, TVariables>>(queryOptions: TQueryOptions, next: (queryOptions: TQueryOptions) => IObservable<IGraphResponse<TQuery>>): IObservable<IGraphResponse<TQuery>> {

      const queryName = this.getQueryName(queryOptions);

      const key = this.getCacheKey(queryName, queryOptions.variables);

      let cacheRef = this._cache.get(key);
      if (!cacheRef) {

         cacheRef = {
            key,
            refresh: () => {
               setTimeout(() => {
                  cacheRef!.initialized = true;
                  cacheRef?.nextSubscription?.unsubscribe();
                  cacheRef!.nextSubscription = next(queryOptions).subscribe(value => {
                     cacheRef!.hasFirstValue = true;
                     cacheRef!.lastValue = value;
                     cacheRef!.callbacks.forEach(cb => cb(value));
                  });
               });
            },
            initialized: false,
            hasFirstValue: false,
            count: 0,
            callbacks: [],
            nextSubscription: null,
            lastValue: undefined
         };
         this._cache.set(key, cacheRef);
      }

      return {
         subscribe: cb => {

            console.assert(cacheRef);
            if (!cacheRef) { return null as any; }

            cacheRef.count++;
            cacheRef.callbacks.push(cb);

            if (!cacheRef.initialized) {
               cacheRef.refresh();
            } else if (cacheRef.hasFirstValue) {
               cb(cacheRef.lastValue);
            }

            return {
               unsubscribe: async () => {
                  cacheRef!.count--;
                  await nextTick();
                  if (cacheRef!.count) { return; }
                  cacheRef!.nextSubscription?.unsubscribe();
                  cacheRef!.nextSubscription = null;
                  cacheRef!.lastValue = undefined;
                  console.assert(this._cache.delete(cacheRef!.key));
               }
            };
         }
      };

   }

   public isCached(queryOptions: IQueryOptions<any, any>): boolean {
      const queryName = this.getQueryName(queryOptions);
      const cacheKey = this.getCacheKey(queryName, queryOptions.variables);
      return this._cache.has(cacheKey);
   }

   private getQueryName(queryOptions: IQueryOptions<any, any>): string {
      const queryNodes = queryOptions.query.definitions.filter(d => d.kind === 'OperationDefinition' && d.operation === 'query') as OperationDefinitionNode[];
      console.assert(queryNodes.length === 1);
      const queryNode = queryNodes[0];

      const queryName = queryNode.name?.value;
      console.assert(queryName);

      return queryName!;
   }

   private getCacheKey(queryName: string, variables: Record<string, any> | null | undefined): string {
      return `${queryName}:${JSON.stringify(variables ?? {})}`;
   }
}

interface ICacheRef {
   key: string;
   refresh: () => void;
   initialized: boolean;
   hasFirstValue: boolean;
   count: number;
   callbacks: ((data: IGraphResponse<any>) => void | Promise<void>)[];
   nextSubscription: { unsubscribe: () => void } | null;
   lastValue: any;
}

export interface ICacheOptions {
   /** When given, the cache will listen for updates from the server and automatically re-fetch queries */
   socketClient: ISocketClient
}
