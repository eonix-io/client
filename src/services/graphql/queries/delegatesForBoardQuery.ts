import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';
import { delegateFullFragment } from '../..';
import { DelegateOrPendingFull, UUID } from '../../../types';

let _query: TypedDocumentNode | undefined;
export function delegatesForBoardQuery(boardId: UUID): QueryOptions<{ boardId: UUID }, { delegatesForBoard: DelegateOrPendingFull[] }> {
   const query = _query ??= gql`
      query delegatesForBoard($boardId: String!) {
         delegatesForBoard(boardId: $boardId) {
            ...DelegateFullFragment
         }
      }

      ${delegateFullFragment}
   `;

   return {
      query,
      variables: { boardId }
   };
}