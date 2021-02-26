import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';
import { boardFragment } from '../..';
import { IBoard } from '../../../types';


type QueryResult = { boards: IBoard[] }

let _query: TypedDocumentNode | undefined;
export function boardsQuery(): QueryOptions<undefined, QueryResult> {
   const query = _query ??= gql`
      query boards {
         boards {
            ...BoardFragment
         }
      }

      ${boardFragment}
   `;

   return {
      query
   };
}