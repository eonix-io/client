

import { DocumentNode, parse } from 'graphql';
import { QueryOptions } from '../..';
import { IUx, UUID } from '../../../types';
import { uxFragment } from '../fragments';


let _query: DocumentNode | undefined;
export function uxsForBoardQuery(boardId: UUID): QueryOptions<{ boardId: UUID }, { uxsForBoard: IUx[] }> {
   const query = _query ??= parse(`
      query uxsForBoard($boardId: String!) {
         uxsForBoard(boardId: $boardId) {
            ...UxFragment
         }
      }

      ${uxFragment}
   `);

   return {
      query,
      variables: { boardId }
   };
}