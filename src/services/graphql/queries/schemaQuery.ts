

import { DocumentNode, parse } from 'graphql';
import { QueryOptions } from '../..';
import { ISchema, UUID } from '../../../types';
import { schemaFragment } from '../fragments';


let _query: DocumentNode | undefined;
export function schemaQuery<AppDataType = any, InputDataType = any>(schemaId: UUID): QueryOptions<{ schemaId: UUID }, { schema: ISchema<AppDataType, InputDataType> | null }> {
   const query = _query ??= parse(`
      query schema($schemaId: String!) { 
         schema(schemaId: $schemaId) { 
            ...SchemaFragment
         } 
      }

      ${schemaFragment}
   `);

   return {
      query,
      variables: { schemaId }
   };
}