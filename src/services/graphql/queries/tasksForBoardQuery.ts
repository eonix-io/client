

import { DocumentNode, parse } from 'graphql';
import { QueryOptions } from '../..';
import { ITask, UUID } from '../../../types';
import { taskFragment } from '../fragments';


let _query: DocumentNode | undefined;
export function tasksForBoardQuery<AppDataType = any, ValueAppDataType = any>(boardId: UUID): QueryOptions<{ boardId: UUID }, { tasksForBoard: ITask<AppDataType, ValueAppDataType>[] }> {
   const query = _query ??= parse(`
      query tasksForBoard($boardId: String!) { 
         tasksForBoard(boardId: $boardId) { 
               ...TaskFragment
         } 
      }

      ${taskFragment}
   `);

   return {
      query,
      variables: { boardId }
   };
}