import { gql } from '@apollo/client/core';
import { DocumentNode } from 'graphql';
import { delegateFullFragment, delegatesForBoardQuery } from '..';
import { deepClone } from '../..';
import { delegateInputToDelegate, IDelegatePendingInput } from '../../../types';
import { EonixClient } from '../EonixClient';

let mutation: DocumentNode | undefined;
export async function putDelegatePendingMutation(eonixClient: EonixClient, delegate: IDelegatePendingInput): Promise<void> {

   if (!mutation) {
      mutation = gql`
         mutation putDelegatePending($delegate: DelegatePendingInput!) {
            putDelegatePending(delegate: $delegate) {
               ...DelegateFullFragment
            }
         }

         ${delegateFullFragment}
      `;
   }

   const variables = {
      delegate
   };

   const optimisticResponse = {
      putDelegatePending: {
         __typename: 'DelegatePending',
         ...delegateInputToDelegate(delegate, eonixClient.tokenUserId, new Date().getTime()),
         boardDetail: {
            __typename: 'DelegateBoardDetail',
            name: ''
         }
      }
   };

   optimisticResponse.putDelegatePending.inputAccess = optimisticResponse.putDelegatePending.inputAccess.map(i => ({ __typename: 'DelegateInputAccess', ...i }));

   await eonixClient.mutate({
      mutation,
      variables,
      optimisticResponse,
      update(store, fetchResult) {
         console.assert(fetchResult.data?.putDelegatePending);
         if (!fetchResult.data?.putDelegatePending) { return; }

         const query = delegatesForBoardQuery(delegate.boardId);

         const delegatesForBoard = store.readQuery(query);

         if (!delegatesForBoard) { return; }

         const existingIndex = delegatesForBoard.delegatesForBoard.findIndex(u => u.id === delegate.id);

         const newStoreData = deepClone(delegatesForBoard);
         if (existingIndex > -1) {
            newStoreData.delegatesForBoard[existingIndex] = fetchResult.data.putDelegatePending;
         } else {
            newStoreData.delegatesForBoard.push(fetchResult.data.putDelegatePending);
         }

         store.writeQuery({
            ...query,
            data: newStoreData
         });
      }

   });

}