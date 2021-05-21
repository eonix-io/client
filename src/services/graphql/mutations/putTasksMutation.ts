import { gql, QueryOptions } from '@apollo/client/core';
import { DocumentNode } from 'graphql';
import { tasksForBoardQuery } from '..';
import { deepClone } from '../..';
import { isChecklistInput, isFileInput, isFileValue, isListValue, isScalarValue, isSelectInput, isTaskReferenceInput, isTaskReferenceValue, isTextInput, ITask, ITaskInput, taskInputToTask, UUID } from '../../../types';
import { EonixClient } from '../EonixClient';
import { taskFragment } from '../fragments';

let mutation: DocumentNode | undefined;
export async function putTasksMutation(eonixClient: EonixClient, taskInputs: ITaskInput[]): Promise<void> {

   if (!mutation) {
      mutation = gql`
         mutation putTasks($tasks: [TaskInput!]!) { 
            putTasks(tasks: $tasks) {
                  ...TaskFragment
            }
         }

         ${taskFragment}
      `;
   }

   const variables = {
      tasks: taskInputs
   };

   const optimisticValues = taskInputs.map(taskInput => {
      const { scalarValues, fileValues, listValues, taskReferenceValues } = taskInput;
      return {
         ...createTaskWithTypenamesFromInput(taskInput, eonixClient.tokenUserId),
         values: [...scalarValues ?? [], ...fileValues ?? [], ...listValues ?? [], ...taskReferenceValues ?? []].map(i => {
            const value: any = { ...i, __typename: `${i.type[0].toUpperCase()}${i.type.substring(1)}Value` };
            if (isFileValue(i)) {
               value.value = { ...i.value, __typename: 'FileProperties' };
            } else if (isScalarValue(i)) {
               value.value = { ...i.value, __typename: 'ScalarValueValue' };
            } else if (isListValue(i)) {
               value.values = i.values;
            } else if (isTaskReferenceValue(i)) {
               //Nothing to do here since there is not child value option
            } else {
               console.error('Unknown value type', { value: i });
            }

            return value;
         })
      };
   });

   const optimisticResponse = {
      putTasks: optimisticValues
   };

   await eonixClient.mutate({
      mutation,
      variables,
      optimisticResponse,
      update(store, fetchResult) {

         const cachedQueries: Map<string, { storeData: QueryOptionDataType<typeof tasksForBoardQuery> | null, boardQuery: ReturnType<typeof tasksForBoardQuery> }> = new Map();

         fetchResult.data?.putTasks.forEach(taskInput => {

            let cacheEntry = cachedQueries.get(taskInput.boardId) ?? null;
            if (!cacheEntry) {
               const boardQuery = tasksForBoardQuery(taskInput.boardId);
               const storeData = deepClone(store.readQuery(boardQuery));
               cachedQueries.set(taskInput.boardId, cacheEntry = { storeData, boardQuery });
            }

            if (cacheEntry.storeData) {
               const storeIndex = cacheEntry.storeData.tasksForBoard.findIndex(b => b.id === taskInput.id);
               if (storeIndex > -1) {
                  cacheEntry.storeData.tasksForBoard.splice(storeIndex, 1, taskInput);
               } else {
                  cacheEntry.storeData.tasksForBoard.push(taskInput);
               }
            }
         });

         for (const query of cachedQueries.values()) {
            store.writeQuery({ ...query.boardQuery, data: query.storeData });
         }

      }

   });

}

type QueryOptionDataType<T> = T extends (...args: any[]) => QueryOptions<infer _, infer Y> ? Y : never;

function createTaskWithTypenamesFromInput(taskInput: ITaskInput, createdById: UUID): ITask {
   const task = {
      __typename: 'Task',
      ...taskInputToTask(taskInput, createdById, Date.now())
   };

   if (task.taskSchema) {

      (task.taskSchema as any).__typename = 'TaskSchema';

      task.taskSchema.inputs.forEach(i => {

         (i as any).__typename = `TaskSchema${i.type[0].toUpperCase()}${i.type.substring(1)}Input`;

         if (isSelectInput(i)) {
            (i.options as any).__typename = 'TaskSchemaTextValueOptions';
            i.options.options = i.options.options?.map(o => ({ ...o, __typename: 'TaskSchemaTextValueOption' })) || null;
         } else if (isTextInput(i)) {
            (i.options as any).__typename = 'TaskSchemaTextOptions';
         } else if (isFileInput(i)) {
            (i.options as any).__typename = 'TaskSchemaFileOptions';
         } else if (isChecklistInput(i)) {
            (i.options as any).__typename = 'TaskSchemaTextValueOptions';
            i.options.options = i.options.options?.map(o => ({ ...o, __typename: 'TaskSchemaTextValueOption' })) || null;
         } else if (isTaskReferenceInput(i)) {
            //Nothing to do with tasks since they don't have a options argument
         } else {
            console.error(`Unknown input type - ${i.type}`);
         }

      });

   }

   return task;
}