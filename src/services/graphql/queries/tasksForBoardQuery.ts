import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';

import { ITask, UUID } from '../../../types';
import { taskFragment } from '../fragments';


let _query: TypedDocumentNode | undefined;
export function tasksForBoardQuery(boardId: UUID): QueryOptions<{ boardId: UUID }, { tasksForBoard: ITask[] }> {
   const query = _query ??= gql`
      query tasksForBoard($boardId: String!) { 
         tasksForBoard(boardId: $boardId) { 
               ...TaskFragment
         } 
      }

      ${taskFragment}
   `;

   return {
      query,
      variables: { boardId }
   };
}