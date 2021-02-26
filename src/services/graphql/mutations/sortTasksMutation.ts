import { gql } from '@apollo/client/core';
import { DocumentNode } from 'graphql';
import { ITask, ITaskSortInput, UUID } from '../../../types';
import { EonixClient } from '../EonixClient';
import { taskFragment } from '../fragments';

let mutation: DocumentNode | undefined;
export async function sortTasksMutation(eonixClient: EonixClient, boardId: UUID, taskSorts: ITaskSortInput[]): Promise<void> {

   if (!mutation) {
      mutation = gql`
         mutation sortTasks($boardId: String!, $taskSorts: [TaskSortInput!]!) { 
            sortTasks(boardId: $boardId, taskSorts: $taskSorts)
         }
      `;
   }

   const variables = {
      boardId,
      taskSorts
   };

   const optimisticResponse = {
      sortTasks: true
   };

   await eonixClient.mutate({
      mutation,
      variables,
      optimisticResponse,
      update(store) {
         for (const taskSort of taskSorts) {
            const fragmentId = `Task:${taskSort.taskId}`;
            let task = store.readFragment<ITask>({ fragmentName: 'TaskFragment', fragment: taskFragment, id: fragmentId });
            if (!task) { continue; }
            if (task.sort === taskSort.sort) { continue; }
            task = { ...task };
            task.sort = taskSort.sort;
            store.writeFragment({ fragmentName: 'TaskFragment', fragment: taskFragment, id: fragmentId, data: task });
         }
      }

   });

}