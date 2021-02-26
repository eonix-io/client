import { gql } from '@apollo/client/core';
import { DocumentNode } from 'graphql';
import { grantFullFragment } from '..';
import { deepClone, uuid } from '../..';
import { grantInputToGrant, IGrantFull, IGrantInput, UserStatus } from '../../../types';
import { EonixClient } from '../EonixClient';
import { grantsForBoardQuery, grantsForEntityQuery } from '../queries';

let mutation: DocumentNode | undefined;
export async function putGrantMutation(eonixClient: EonixClient, grantInput: IGrantInput): Promise<void> {

   if (!mutation) {
      mutation = gql`
         mutation putGrant($grant: GrantInput!) {
            putGrant(grant: $grant) {
               ...GrantFullFragment
            }
         }

         ${grantFullFragment}
      `;
   }

   const variables = {
      grant: grantInput
   };

   const existingGrants = await new Promise<IGrantFull[]>(r => {
      const boardGrantsQuery = grantsForBoardQuery(grantInput.boardId);
      const sub = eonixClient.watchQuery(boardGrantsQuery).subscribe(g => {
         sub.unsubscribe();
         r(g.grantsForBoard);
      });
   });

   const existingGrant = existingGrants.find(g => g.id === grantInput.id);

   const optimisticResponse = {
      putGrant: {
         __typename: 'Grant',
         ...grantInputToGrant(grantInput, eonixClient.tokenUserId, Date.now()),
         entity: {
            __typename: 'User',
            id: existingGrant?.entity.id || uuid(),
            avatarUrl: null,
            createdDate: existingGrant?.entity.createdDate || Date.now(),
            email: existingGrant?.entity.email || '',
            emailMd5: existingGrant?.entity.emailMd5 || null,
            name: existingGrant?.entity.name || '',
            status: existingGrant?.entity.status || UserStatus.Guest
         }
      } as IGrantFull
   };

   await eonixClient.mutate({
      mutation,
      variables,
      optimisticResponse,
      update(store, fetchResult) {
         const putGrant = fetchResult.data!.putGrant;

         const forBoardQuery = grantsForBoardQuery(putGrant.boardId);
         const forBoardData = store.readQuery(forBoardQuery);
         if (forBoardData) {

            const newData = deepClone(forBoardData);
            const existingIndex = forBoardData.grantsForBoard.findIndex(b => b.id === putGrant.id);

            if (existingIndex > -1) {
               newData.grantsForBoard[existingIndex] = putGrant;
            } else {
               newData.grantsForBoard.push(putGrant);
            }

            store.writeQuery({ ...forBoardQuery, data: newData });
         }

         const grantsEntityQuery = grantsForEntityQuery(putGrant.entityId);
         const forEntityData = store.readQuery(grantsEntityQuery);
         if (forEntityData) {

            const newData = deepClone(forEntityData);
            const existingIndex = forEntityData.grantsForEntity.findIndex(b => b.id === putGrant.id);

            if (existingIndex > -1) {
               newData.grantsForEntity[existingIndex] = putGrant;
            } else {
               newData.grantsForEntity.push(putGrant);
            }

            store.writeQuery({ ...grantsEntityQuery, data: newData });
         }
      }

   });

}