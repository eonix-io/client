import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';
import { grantFullFragment } from '../..';
import { IGrantFull, UUID } from '../../../types';


let _query: TypedDocumentNode | undefined;
export function grantsForBoardQuery(boardId: UUID): QueryOptions<{ boardId: UUID }, { grantsForBoard: IGrantFull[] }> {
   const query = _query ??= gql`
      query grantsForBoard($boardId: String!) {
         grantsForBoard(boardId: $boardId) {
            ...GrantFullFragment
         }
      }

      ${grantFullFragment}
   `;

   return {
      query,
      variables: { boardId }
   };
}