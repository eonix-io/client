import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';
import { boardFragment } from '../..';
import { IBoard, UUID } from '../../../types';


let _query: TypedDocumentNode | undefined;
export function boardQuery<T>(boardId: UUID): QueryOptions<{ boardId: UUID }, { board: IBoard<T> | null }> {
   const query = _query ??= gql`
      query board($boardId: String!) { 
         board(boardId: $boardId) { 
            ...BoardFragment
         } 
      },

      ${boardFragment}
   `;

   return {
      query,
      variables: { boardId }
   };
}