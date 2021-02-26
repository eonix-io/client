import { gql } from '@apollo/client/core';
import { DocumentNode } from 'graphql';
import { grantsForBoardQuery } from '..';
import { GrantClaim, UUID } from '../../../types';
import { EonixClient } from '../EonixClient';
import { userFullFragment } from '../fragments';

let mutation: DocumentNode | undefined;
export async function inviteEmailToBoard(eonixClient: EonixClient, boardId: UUID, email: string, message: string, claims: GrantClaim[], redirect: string): Promise<void> {

   if (!mutation) {
      mutation = gql`
         mutation inviteEmailToBoard($boardId: String!, $email: String!, $message: String!, $claims: [GrantClaim!]!, $redirect: String) {
            inviteEmailToBoard(boardId: $boardId, email: $email, message: $message, claims: $claims, redirect: $redirect) {
               ...UserFullFragment
            }
         }

         ${userFullFragment}
      `;
   }

   const variables = {
      email,
      message,
      boardId,
      claims,
      redirect
   };

   await eonixClient.mutate({
      mutation,
      variables,
      refetchQueries: [
         grantsForBoardQuery(boardId)
         //We should be updating grantsForEntity as well but we don't know the userId until the call returns
      ]
   });

}