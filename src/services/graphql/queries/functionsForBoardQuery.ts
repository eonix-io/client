
import { DocumentNode, parse } from 'graphql';
import { QueryOptions } from '../..';
import { IFunction, UUID } from '../../../types';
import { functionFragment } from '../fragments';


let _query: DocumentNode | undefined;
export function functionsForBoardQuery(boardId: UUID): QueryOptions<{ boardId: UUID }, { functionsForBoard: IFunction[] }> {
   const query = _query ??= parse(`
      query functionsForBoard($boardId: String!) { 
         functionsForBoard(boardId: $boardId) { 
               ...FunctionFragment
         } 
      }

      ${functionFragment}
   `);

   return {
      query,
      variables: { boardId }
   };
}