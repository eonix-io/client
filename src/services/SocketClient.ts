import { io } from 'socket.io-client';
import { IGraphQueryUpdate, IObservable, ObservableCallback, UUID, uuid } from '..';

export class SocketClient implements ISocketClient {

   private _token: string | (() => string);
   private readonly _sessionId: string;
   private readonly _options: Required<ISocketOptions>;

   public constructor(token: string | (() => string), options?: ISocketOptions) {

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

   private readonly _connectionEventSubscriptions: ObservableCallback<IConnectionEvent>[] = [];
   private _connectionEvents$: IObservable<IConnectionEvent> = {
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
   public get socketEvents(): IObservable<IConnectionEvent> { return this._connectionEvents$; }

   private readonly _queryUpdateSubscriptions: ObservableCallback<IGraphQueryUpdate>[] = [];
   private _queryUpdate$: IObservable<IGraphQueryUpdate> = {
      subscribe: (cb) => {
         this._queryUpdateSubscriptions.push(cb);

         return {
            unsubscribe: () => {
               const i = this._queryUpdateSubscriptions.findIndex(c => c === cb);
               this._queryUpdateSubscriptions.slice(i, 1);
            }
         };
      }
   }

   public get queryUpdates(): IObservable<IGraphQueryUpdate> { return this._queryUpdate$; }

   private startSocket(): void {

      const socket = io(this._options.host, {
         query: {
            userId: this.tokenUserId,
            token: this.token,
            sessionId: this._sessionId
         }
      });

      socket.on('connect', () => {
         this._connectionEventSubscriptions.forEach(cb => cb({ connected: true }));
      });

      socket.on('disconnect', () => {
         this._connectionEventSubscriptions.forEach(cb => cb({ connected: false }));
      });

      socket.on('query-update', (data: IGraphQueryUpdate) => {
         this._queryUpdateSubscriptions.forEach(cb => cb(data));
      });

      socket.connect();
   }

}

export interface ISocketClient {
   queryUpdates: SocketClient['queryUpdates'];
}

export interface ISocketOptions {
   /** An optional Eonix server url to connect to. */
   host?: string;
}

export interface IConnectionEvent {
   connected: boolean;
}