
import { DocumentNode, parse } from 'graphql';
import { boardFragment } from '../..';
import { IBoard, UUID } from '../../../types';
import { IQueryOptions } from '../client/IQueryOptions';


let _query: DocumentNode | undefined;
export function boardQuery<T>(boardId: UUID): IQueryOptions<{ boardId: UUID }, { board: IBoard<T> | null }> {
   const query = _query ??= parse(`
      query board($boardId: String!) { 
         board(boardId: $boardId) { 
            ...BoardFragment
         } 
      },

      ${boardFragment}
   `);

   return {
      query,
      variables: { boardId }
   };
}