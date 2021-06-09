import { DocumentNode } from 'graphql';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IQueryOptions<TVariables, TReturn> {

   query: DocumentNode;
   variables: TVariables;

}