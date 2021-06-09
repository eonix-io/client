

import { DocumentNode, parse } from 'graphql';
import { QueryOptions } from '../..';
import { ITask, UUID } from '../../../types';
import { taskFragment } from '../fragments';


let _query: DocumentNode | undefined;
export function taskQuery<AppDataType = any, ValueAppDataType = any>(taskId: UUID): QueryOptions<{ taskId: UUID }, { task: ITask<AppDataType, ValueAppDataType> | null }> {
   const query = _query ??= parse(`
      query task($taskId: String!) { 
         task(taskId: $taskId) { 
               ...TaskFragment
         } 
      }

      ${taskFragment}
   `);

   return {
      query,
      variables: { taskId }
   };
}