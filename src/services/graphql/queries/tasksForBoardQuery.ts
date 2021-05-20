import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';

import { ITask, UUID } from '../../../types';
import { taskFragment } from '../fragments';


let _query: TypedDocumentNode | undefined;
export function tasksForBoardQuery<AppDataType = any, ValueAppDataType = any>(boardId: UUID): QueryOptions<{ boardId: UUID }, { tasksForBoard: ITask<AppDataType, ValueAppDataType>[] }> {
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