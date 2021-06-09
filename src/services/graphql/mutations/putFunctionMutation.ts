import { parse } from 'graphql';
import { DocumentNode } from 'graphql';
import { functionFragment, functionQuery, functionsForBoardQuery } from '..';
import { deepClone } from '../..';
import { IFunctionInput } from '../../../types';
import { EonixClient } from '../../EonixClient';

let mutation: DocumentNode | undefined;
export async function putFunctionMutation(eonixClient: EonixClient, functionInput: IFunctionInput): Promise<void> {

   if (!mutation) {
      mutation = parse(`
         mutation PutFunction($function: FunctionInput!) { 
            putFunction(function: $function) {
               ...FunctionFull
            }
         }

         ${functionFragment}
      `);
   }

   const variables = {
      function: functionInput
   };

   const optimisticResponse = {
      putFunction: {
         __typename: 'Function',
         createdDate: Date.now(),
         createdBy: eonixClient.tokenUserId,
         ...functionInput
      }
   };

   await eonixClient.mutate({
      mutation,
      variables,
      optimisticResponse,
      update(store, fetchResult) {
         console.assert(fetchResult.data?.putFunction);
         const funcQuery = functionQuery(functionInput.id);
         store.writeQuery({ ...funcQuery, data: { function: fetchResult.data!.putFunction } });


         const funcBoardQuery = functionsForBoardQuery(functionInput.boardId);
         const functionsForBoardStoreData = store.readQuery(funcBoardQuery);

         if (!functionsForBoardStoreData) { return; }
         const storeIndex = functionsForBoardStoreData.functionsForBoard.findIndex(b => b.id === functionInput.id);

         const newStoreData = deepClone(functionsForBoardStoreData);

         if (storeIndex > -1) {
            newStoreData.functionsForBoard[storeIndex] = fetchResult.data!.putFunction;
         } else {
            newStoreData.functionsForBoard.push(fetchResult.data!.putFunction);
         }

         store.writeQuery({ ...funcBoardQuery, data: newStoreData });

      }

   });

}