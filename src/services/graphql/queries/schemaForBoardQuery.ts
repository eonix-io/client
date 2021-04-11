import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';
import { ISchema, UUID } from '../../../types';
import { schemaFragment } from '../fragments';


let _query: TypedDocumentNode | undefined;
export function schemaForBoardQuery<AppDataType = any, InputDataType = any>(boardId: UUID): QueryOptions<{ boardId: UUID }, { schemaForBoard: ISchema<AppDataType, InputDataType> | null }> {
   const query = _query ??= gql`
      query schemaForBoard($boardId: String!) { 
         schemaForBoard(boardId: $boardId) { 
            ...SchemaFragment
         } 
      }

      ${schemaFragment}
   `;

   return {
      query,
      variables: { boardId }
   };
}