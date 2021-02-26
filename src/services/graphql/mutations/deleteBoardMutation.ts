import { gql } from '@apollo/client/core';
import { DocumentNode } from 'graphql';
import { boardsQuery } from '..';
import { IBoard, UUID } from '../../../types';
import { EonixClient } from '../EonixClient';

let mutation: DocumentNode | undefined;
export async function deleteBoardMutation(eonixClient: EonixClient, boardId: UUID): Promise<void> {

   if (!mutation) {
      mutation = gql`
         mutation deleteBoard($boardId: String!) {
            deleteBoard(boardId: $boardId)
         }
      `;
   }

   const variables = {
      boardId
   };

   const optimisticResponse = {
      deleteBoard: {}
   };

   await eonixClient.mutate({
      mutation,
      variables,
      optimisticResponse,
      update(store) {
         const boardsStoreQuery = boardsQuery();
         const boardsData = store.readQuery(boardsStoreQuery) as { boards: IBoard[] };
         if (!boardsData) { return; }
         const newBoardsData = { boards: boardsData.boards.filter(b => b.id !== boardId) };
         store.writeQuery({ ...boardsStoreQuery, data: newBoardsData });
      }

   });

}