import { gql } from '@apollo/client/core';
import { DocumentNode } from 'graphql';
import { delegateFullFragment, delegatesForBoardQuery } from '..';
import { deepClone } from '../..';
import { delegateInputToDelegate, IDelegateInput } from '../../../types';
import { EonixClient } from '../../EonixClient';

let mutation: DocumentNode | undefined;
export async function putDelegateMutation(eonixClient: EonixClient, delegate: IDelegateInput): Promise<void> {

   if (!mutation) {
      mutation = gql`
         mutation putDelegate($delegate: DelegateInput!) {
            putDelegate(delegate: $delegate) {
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
      putDelegate: {
         __typename: 'Delegate',
         ...delegateInputToDelegate(delegate, eonixClient.tokenUserId, new Date().getTime()),
         boardDetail: {
            __typename: 'DelegateBoardDetail',
            name: ''
         },
         delegateBoardDetail: {
            __typename: 'DelegateBoardDetail',
            name: ''
         }
      }
   };

   optimisticResponse.putDelegate.inputAccess = optimisticResponse.putDelegate.inputAccess.map(i => ({ __typename: 'DelegateInputAccess', ...i }));

   await eonixClient.mutate({
      mutation,
      variables,
      optimisticResponse,
      update(store, fetchResult) {
         if (!fetchResult.data?.putDelegate) { return; }

         const query = delegatesForBoardQuery(delegate.boardId);
         const delegatesForBoard = store.readQuery(query);

         if (!delegatesForBoard) { return; }

         const existingIndex = delegatesForBoard.delegatesForBoard.findIndex(u => u.id === delegate.id);

         const newStoreData = deepClone(delegatesForBoard);
         if (existingIndex > -1) {
            newStoreData.delegatesForBoard[existingIndex] = fetchResult.data.putDelegate;
         } else {
            newStoreData.delegatesForBoard.push(fetchResult.data.putDelegate);
         }

         store.writeQuery({
            ...query,
            data: newStoreData
         });
      }

   });

}