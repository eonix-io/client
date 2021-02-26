import { gql } from '@apollo/client/core';
import { DocumentNode } from 'graphql';
import { boardsQuery, grantsForEntityQuery } from '..';
import { IBoardCopyOptions, UUID } from '../../../types';
import { EonixClient } from '../EonixClient';

let mutation: DocumentNode | undefined;
export async function copyBoardMutation(eonixClient: EonixClient, boardId: UUID, options: IBoardCopyOptions): Promise<void> {

   if (!mutation) {
      mutation = gql`
         mutation copyBoard($boardId: String!, $options: BoardCopyOptions!) {
            copyBoard(boardId: $boardId, options: $options)
         }
      `;
   }

   const variables = {
      boardId,
      options
   };

   await eonixClient.mutate({
      mutation,
      variables,
      refetchQueries: [
         boardsQuery(),
         grantsForEntityQuery(eonixClient.tokenUserId)
      ]
   });

}