import { parse } from 'graphql';
import { DocumentNode } from 'graphql';
import { tasksForBoardQuery } from '..';
import { UUID } from '../../../types';
import { EonixClient } from '../../EonixClient';

let mutation: DocumentNode | undefined;
export async function deleteTaskMutation(eonixClient: EonixClient, taskId: UUID, boardId: UUID): Promise<void> {

   if (!mutation) {
      mutation = parse(`
         mutation deleteTask($taskId: String!) {
            deleteTask(taskId: $taskId)
         }
      `);
   }

   const variables = {
      taskId
   };

   const optimisticResponse = {
      deleteTask: true
   };

   await eonixClient.mutate({
      mutation,
      variables,
      optimisticResponse,
      update(store) {
         const forBoardQuery = tasksForBoardQuery(boardId);

         const tasksForBoardData = store.readQuery(forBoardQuery);

         if (tasksForBoardData) {
            const newTasksForBoardData = { tasksForBoard: tasksForBoardData.tasksForBoard.filter(t => t.id !== taskId) };
            store.writeQuery({ ...forBoardQuery, data: newTasksForBoardData });
         }

      }

   });

}