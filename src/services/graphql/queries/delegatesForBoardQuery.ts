
import { DocumentNode, parse } from 'graphql';
import { delegateFullFragment, QueryOptions } from '../..';
import { DelegateOrPendingFull, UUID } from '../../../types';

let _query: DocumentNode | undefined;
export function delegatesForBoardQuery(boardId: UUID): QueryOptions<{ boardId: UUID }, { delegatesForBoard: DelegateOrPendingFull[] }> {
   const query = _query ??= parse(`
      query delegatesForBoard($boardId: String!) {
         delegatesForBoard(boardId: $boardId) {
            ...DelegateFullFragment
         }
      }

      ${delegateFullFragment}
   `);

   return {
      query,
      variables: { boardId }
   };
}