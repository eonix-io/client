
import { DocumentNode, parse } from 'graphql';
import { grantFullFragment, QueryOptions } from '../..';
import { IGrantFull, UUID } from '../../../types';


let _query: DocumentNode | undefined;
export function grantsForBoardQuery(boardId: UUID): QueryOptions<{ boardId: UUID }, { grantsForBoard: IGrantFull[] }> {
   const query = _query ??= parse(`
      query grantsForBoard($boardId: String!) {
         grantsForBoard(boardId: $boardId) {
            ...GrantFullFragment
         }
      }

      ${grantFullFragment}
   `);

   return {
      query,
      variables: { boardId }
   };
}