import { IObservable } from '../../../types';
import { IGraphResponse } from './IGraphResponse';
import { IQueryOptions } from './IQueryOptions';

export interface IGraphMiddleware {

   intercept<TQuery, TVariables, TQueryOptions extends IQueryOptions<TQuery, TVariables>>(queryOptions: TQueryOptions, next: (queryOptions: TQueryOptions) => IObservable<IGraphResponse<TQuery>>): IObservable<IGraphResponse<TQuery>>;

}