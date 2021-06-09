import * as FormData from 'form-data';
import axios from 'axios';
import { uuid } from './uuid';
import { IObservable, UUID } from '../types';
import { SocketClient } from './SocketClient';
import { IQueryOptions } from './graphql/client/IQueryOptions';
import { GraphClient } from './graphql/client/GraphClient';

export class EonixClient {

   private _token: string | (() => string);
   private readonly _sessionId: string;
   private readonly _options: Required<IClientOptions>;
   private readonly _socketClient: SocketClient;

   public constructor(token: string | (() => string), options?: IClientOptions) {

      if (!token) { throw new Error('Missing token'); }

      this._token = token;
      this._sessionId = uuid();

      this._options = {
         host: options?.host ?? 'https://eonix.io'
      };

      if (this._options.host.endsWith('/')) { throw new Error('Host should not have a trailing slash'); }

      this._socketClient = new SocketClient(token, { host: this._options.host });

   }

   private get token(): string {
      if (typeof this._token === 'string') { return this._token ?? ''; }
      return this._token() ?? '';
   }

   /** Extract the userId from the token */
   public get tokenUserId(): UUID {
      return this.token as UUID;
   }

   public watchQuery<TVar, TData>(query: IQueryOptions<TVar, TData>): IObservable<TData> {
      const query$ = this.graphClient.watchQuery(query);
      return query$;
   }

   public async mutate<TVar, TData>(mutation: MutationOptions<TData, TVar>): Promise<void> {
      await this.graphClient.mutate(mutation);
   }

   //#region ApolloClient

   private _graphClient: GraphClient | undefined;
   private get graphClient(): GraphClient {

      if (this._graphClient) { return this._graphClient; }

      this._graphClient = new GraphClient(`${this._options.host}/api/graphql`, {
         authorization: () => this.token,
         cache: {
            socketClient: this._socketClient
         }
      });

      return this._graphClient;
   }

   //#endregion

   //#region REST

   /** Uploads a file that is to be used within a link/image in a markdown field of a task. Returns the relative path of the uploaded file */
   public async uploadMarkdownFile(taskId: UUID, inputId: UUID, filename: string, buffer: Buffer): Promise<string> {

      const formData = new FormData();
      formData.append('file', buffer, { filename });

      const apiUrl = new URL('/api/file/markdown', this._options.host);
      apiUrl.search = new URLSearchParams({ taskId, inputId }).toString();

      const res = await axios.post(apiUrl.toString(), formData, {
         // You need to use `getHeaders()` in Node.js because Axios doesn't
         // automatically set the multipart form boundary in Node.
         headers: {
            ...formData.getHeaders(),
            'Authorization': this.token
         },
         maxBodyLength: Infinity,
         maxContentLength: Infinity
      });

      return res.data;

   }


   //#endregion

}

export interface IClientOptions {
   /** An optional Eonix server url to connect to. */
   host?: string;
}

