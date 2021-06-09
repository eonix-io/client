import { parse } from 'graphql';
import { DocumentNode } from 'graphql';
import { boardInputToBoard, IBoardInput, UUID } from '../../../types';
import { EonixClient } from '../../EonixClient';
import { boardFragment } from '../fragments';
import { boardQuery, boardsQuery, grantsForEntityQuery } from '../queries';

let mutation: DocumentNode | undefined;
export async function putBoardMutation(eonixClient: EonixClient, boardId: UUID, board: IBoardInput): Promise<void> {

   if (!mutation) {
      mutation = parse(`
         mutation putBoard($boardId: String!, $board: BoardInput!) { 
            putBoard(boardId: $boardId, board: $board) {
               ...BoardFragment
            } 
         }

         ${boardFragment}
      `);
   }

   const variables = {
      boardId,
      board
   };

   const optimisticResponse = {
      __typename: 'Mutation',
      putBoard: {
         __typename: 'Board',
         ...boardInputToBoard(board, Date.now())
      }
   };

   await eonixClient.mutate({
      mutation,
      variables,
      optimisticResponse,
      update(store, fetchResult) {
         const boardsQ = boardsQuery();
         const boardsData = store.readQuery(boardsQ);
         if (boardsData && !boardsData.boards.some(b => b.id === boardId)) {
            const newStoreBoards = { boards: [...boardsData.boards, fetchResult.data!.putBoard] };
            store.writeQuery({ ...boardsQ, data: newStoreBoards });
         }
      },
      refetchQueries: [
         boardQuery(boardId),
         grantsForEntityQuery(eonixClient.tokenUserId)
      ],
      awaitRefetchQueries: true
   });

}