

import { IObservable } from '../../../types';
import { GraphCacheMiddleware, ICacheOptions } from './GraphCacheMiddleware';
import { GraphFetchMiddleware } from './GraphFetchMiddleware';
import { IGraphMiddleware } from './IGraphMiddleware';
import { IQueryOptions } from './IQueryOptions';

export class GraphClient {

   private readonly _middleware: IGraphMiddleware[] = [];

   public constructor(private readonly url: string, private readonly options?: Partial<IGraphOptions>) {

      if (options?.cache) { this._middleware.push(new GraphCacheMiddleware(options.cache)); }
      this._middleware.push(new GraphFetchMiddleware(url, options));

   }

   public watchQuery<TQuery, _, __ extends IQueryOptions<TQuery, _>>(queryOptions: IQueryOptions<_, TQuery>): IObservable<TQuery> {

      const result = this._middleware[0].intercept(queryOptions, (nextOptions) => {
         if (!this._middleware.length) { throw new Error('No additional middleware'); }
         return this._middleware[1].intercept(nextOptions, () => {
            throw new Error('No additional middleware');
         });
      });

      //WE subscribe to the graph result so we can return a obs that simply returns data
      return {
         subscribe: (cb) => {

            const sub = result.subscribe(d => {
               cb(d.data as TQuery);
            });

            return {
               unsubscribe: () => {
                  setTimeout(sub.unsubscribe);
               }
            };

         }
      };

   }

}

export interface IGraphOptions {
   authorization: string | (() => string) | Promise<string>;
   cache: ICacheOptions;
}