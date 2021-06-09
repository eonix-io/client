
import { DocumentNode, parse } from 'graphql';
import { boardFragment, QueryOptions } from '../..';
import { IBoard } from '../../../types';


type QueryResult = { boards: IBoard[] }

let _query: DocumentNode | undefined;
export function boardsQuery(): QueryOptions<undefined, QueryResult> {
   const query = _query ??= parse(`
      query boards {
         boards {
            ...BoardFragment
         }
      }

      ${boardFragment}
   `);

   return {
      query
   };
}