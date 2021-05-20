import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';

import { ITask, UUID } from '../../../types';
import { taskFragment } from '../fragments';


let _query: TypedDocumentNode | undefined;
export function taskQuery<AppDataType = any, ValueAppDataType = any>(taskId: UUID): QueryOptions<{ taskId: UUID }, { task: ITask<AppDataType, ValueAppDataType> | null }> {
   const query = _query ??= gql`
      query task($taskId: String!) { 
         task(taskId: $taskId) { 
               ...TaskFragment
         } 
      }

      ${taskFragment}
   `;

   return {
      query,
      variables: { taskId }
   };
}