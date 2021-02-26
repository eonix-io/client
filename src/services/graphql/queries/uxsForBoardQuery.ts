import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';

import { IUx, UUID } from '../../../types';
import { uxFragment } from '../fragments';


let _query: TypedDocumentNode | undefined;
export function uxsForBoardQuery(boardId: UUID): QueryOptions<{ boardId: UUID }, { uxsForBoard: IUx[] }> {
   const query = _query ??= gql`
      query uxsForBoard($boardId: String!) {
         uxsForBoard(boardId: $boardId) {
            ...UxFragment
         }
      }

      ${uxFragment}
   `;

   return {
      query,
      variables: { boardId }
   };
}