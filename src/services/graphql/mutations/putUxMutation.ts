import { parse } from 'graphql';
import { DocumentNode } from 'graphql';
import { uxFragment } from '..';
import { deepClone } from '../..';
import { IUxInput, uxInputToUx } from '../../../types';
import { EonixClient } from '../../EonixClient';
import { uxQuery, uxsForBoardQuery } from '../queries';

let mutation: DocumentNode | undefined;
export async function putUxMutation(eonixClient: EonixClient, uxInput: IUxInput): Promise<void> {

   if (!mutation) {
      mutation = parse(`
         mutation putUx($ux: UxInput) {
            putUx(ux: $ux) {
               ...UxFragment
            }
         }

         ${uxFragment}
      `);
   }

   const variables = {
      ux: uxInput
   };

   const optimisticResponse = {
      putUx: {
         __typename: 'Ux',
         ...uxInputToUx(uxInput, eonixClient.tokenUserId, new Date().getTime())
      }
   };

   await eonixClient.mutate({
      mutation,
      variables,
      optimisticResponse,
      update(store, fetchResult) {
         if (!fetchResult.data?.putUx) { return; }

         const query = uxQuery(uxInput.id);

         store.writeQuery({
            ...query,
            data: { ux: fetchResult.data.putUx }
         });

         const forBoardQuery = uxsForBoardQuery(uxInput.boardId);
         const uxsForBoard = store.readQuery(forBoardQuery);

         if (!uxsForBoard) { return; }

         const existingIndex = uxsForBoard.uxsForBoard.findIndex(u => u.id === uxInput.id);

         const newStoreData = deepClone(uxsForBoard);
         if (existingIndex > -1) {
            newStoreData.uxsForBoard[existingIndex] = fetchResult.data.putUx;
         } else {
            newStoreData.uxsForBoard.push(fetchResult.data.putUx);
         }

         store.writeQuery({
            ...forBoardQuery,
            data: newStoreData
         });
      }

   });

}