import { gql } from '@apollo/client/core';
import { DocumentNode } from 'graphql';
import { functionsForBoardQuery } from '..';
import { UUID } from '../../../types';
import { EonixClient } from '../../EonixClient';

let mutation: DocumentNode | undefined;
export async function deleteFunctionMutation(eonixClient: EonixClient, boardId: UUID, functionId: UUID): Promise<void> {

   if (!mutation) {
      mutation = gql`
         mutation deleteFunction($functionId: String!) { 
            deleteFunction(functionId: $functionId)
         }
      `;
   }

   const variables = {
      functionId
   };

   const optimisticResponse = {
      deleteFunction: true
   };

   await eonixClient.mutate({
      mutation,
      variables,
      optimisticResponse,
      update(store) {
         const funcBoardQuery = functionsForBoardQuery(boardId);
         const functionsForBoardStoreData = store.readQuery(funcBoardQuery);

         if (!functionsForBoardStoreData) { return; }
         const newFunctions = functionsForBoardStoreData.functionsForBoard.filter(b => b.id !== functionId);
         if (newFunctions.length === functionsForBoardStoreData.functionsForBoard.length) { return; }
         store.writeQuery({ ...funcBoardQuery, data: { functionsForBoard: newFunctions } });
      }

   });

}