import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';

import { ISchema, UUID } from '../../../types';
import { schemaFragment } from '../fragments';


let _query: TypedDocumentNode | undefined;
export function schemaQuery<AppDataType = any, InputDataType = any>(schemaId: UUID): QueryOptions<{ schemaId: UUID }, { schema: ISchema<AppDataType, InputDataType> | null }> {
   const query = _query ??= gql`
      query schema($schemaId: String!) { 
         schema(schemaId: $schemaId) { 
            ...SchemaFragment
         } 
      }

      ${schemaFragment}
   `;

   return {
      query,
      variables: { schemaId }
   };
}