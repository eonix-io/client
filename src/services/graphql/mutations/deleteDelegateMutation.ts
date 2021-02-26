import { gql } from '@apollo/client/core';
import { DocumentNode } from 'graphql';
import { delegatesForBoardQuery } from '..';
import { UUID } from '../../../types';
import { EonixClient } from '../EonixClient';

let mutation: DocumentNode | undefined;
export async function deleteDelegateMutation(eonixClient: EonixClient, boardId: UUID, delegateId: UUID): Promise<void> {

   if (!mutation) {
      mutation = gql`
         mutation DeleteDelegate($delegateId: String!) { 
            deleteDelegate(delegateId: $delegateId)
         }
      `;
   }

   const variables = {
      delegateId
   };

   const optimisticResponse = {
      deleteDelegate: true
   };

   await eonixClient.mutate({
      mutation,
      variables,
      optimisticResponse,
      update(store) {
         const query = delegatesForBoardQuery(boardId);
         const delegatesForBoardStoreData = store.readQuery(query);
         if (!delegatesForBoardStoreData) { return; }
         const newDelegates = delegatesForBoardStoreData.delegatesForBoard.filter(b => b.id !== delegateId);
         if (newDelegates.length === delegatesForBoardStoreData.delegatesForBoard.length) { return; }
         store.writeQuery({ ...query, data: { delegatesForBoard: newDelegates } });
      }

   });

}