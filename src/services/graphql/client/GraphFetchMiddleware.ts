
import { IGraphMiddleware } from './IGraphMiddleware';
import { IGraphResponse } from './IGraphResponse';
import { IQueryOptions } from './IQueryOptions';
import { print } from 'graphql';
import { IObservable } from '../../../types';

export class GraphFetchMiddleware implements IGraphMiddleware {

   public constructor(private readonly url: string, private readonly options?: Partial<IGraphFetchMiddlewareOptions>) {

   }

   public intercept<TQuery, TVariables, TQueryOptions extends IQueryOptions<TQuery, TVariables>>(queryOptions: TQueryOptions, _: (queryOptions: TQueryOptions) => IObservable<IGraphResponse<TQuery>>): IObservable<IGraphResponse<TQuery>> {

      return {
         subscribe: (cb => {

            const body = JSON.stringify({
               query: print(queryOptions.query),
               variables: queryOptions.variables
            });

            this.resolveAuthHeader().then(authHeader => {

               fetch(this.url, {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                     ...authHeader
                  },
                  body
               })
                  .then(r => r.json() as Promise<IGraphResponse<TQuery>>)
                  .then(r => {
                     if (r.errors?.length) {
                        throw new Error(r.errors.map(e => e.message).join(', '));
                     }
                     cb(r);
                  });
            });

            return {
               unsubscribe: () => {
                  return;
               }
            };

         })
      };

   }

   private async resolveAuthHeader(): Promise<{ Authorization?: string }> {
      if (!this.options?.authorization) { return {}; }

      let authValue = '';
      if (typeof this.options.authorization === 'string') {
         authValue = this.options.authorization;
      } else if (typeof this.options.authorization === 'function') {
         authValue = await Promise.resolve(this.options.authorization());
      } else {
         authValue = await Promise.resolve(this.options.authorization);
      }

      return { Authorization: authValue };
   }

}

export interface IGraphFetchMiddlewareOptions {
   authorization: string | (() => string | Promise<string>) | Promise<string>;
}