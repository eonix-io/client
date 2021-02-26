import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';
import { IFunction, UUID } from '../../../types';
import { functionFragment } from '../fragments';


let _query: TypedDocumentNode | undefined;
export function functionsForBoardQuery(boardId: UUID): QueryOptions<{ boardId: UUID }, { functionsForBoard: IFunction[] }> {
   const query = _query ??= gql`
      query functionsForBoard($boardId: String!) { 
         functionsForBoard(boardId: $boardId) { 
               ...FunctionFragment
         } 
      }

      ${functionFragment}
   `;

   return {
      query,
      variables: { boardId }
   };
}