
import { DocumentNode, parse } from 'graphql';
import { QueryOptions } from '../..';
import { ISchema, UUID } from '../../../types';
import { schemaFragment } from '../fragments';


let _query: DocumentNode | undefined;
export function schemaForBoardQuery<AppDataType = any, InputDataType = any>(boardId: UUID): QueryOptions<{ boardId: UUID }, { schemaForBoard: ISchema<AppDataType, InputDataType> | null }> {
   const query = _query ??= parse(`
      query schemaForBoard($boardId: String!) { 
         schemaForBoard(boardId: $boardId) { 
            ...SchemaFragment
         } 
      }

      ${schemaFragment}
   `);

   return {
      query,
      variables: { boardId }
   };
}