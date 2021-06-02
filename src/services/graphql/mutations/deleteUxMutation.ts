import { gql } from '@apollo/client/core';
import { DocumentNode } from 'graphql';
import { UUID } from '../../../types';
import { EonixClient } from '../../EonixClient';
import { uxsForBoardQuery } from '../queries';

let mutation: DocumentNode | undefined;
export async function deleteUxMutation(eonixClient: EonixClient, boardId: UUID, uxId: UUID): Promise<void> {

   if (!mutation) {
      mutation = gql`
         mutation deleteUx($uxId: String!) { 
            deleteUx(uxId: $uxId)
         }
      `;
   }

   const variables = {
      uxId
   };

   const optimisticResponse = {
      deleteUx: true
   };

   await eonixClient.mutate({
      mutation,
      variables,
      optimisticResponse,
      update(store) {

         const forBoardQuery = uxsForBoardQuery(boardId);

         const uxsForBoardStoreData = store.readQuery(forBoardQuery);
         if (!uxsForBoardStoreData) { return; }
         const newUxs = uxsForBoardStoreData.uxsForBoard.filter(b => b.id !== uxId);
         if (newUxs.length === uxsForBoardStoreData.uxsForBoard.length) { return; }
         store.writeQuery({ ...forBoardQuery, data: { uxsForBoard: newUxs } });
      }

   });

}