import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';

import { ITask, UUID } from '../../../types';
import { taskFragment } from '../fragments';


let _query: TypedDocumentNode | undefined;
export function taskQuery(taskId: UUID): QueryOptions<{ taskId: UUID }, { task: ITask | null }> {
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