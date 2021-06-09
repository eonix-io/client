import { parse } from 'graphql';

import { schemaInputFragment } from './schemaInputFragment';

export const schemaFragment = parse(`
   fragment SchemaFragment on Schema {
      id, 
      name,
      createdDate,
      createdBy,
      appData
      inputs {
         ...SchemaInputFragment
      }
   }

   ${schemaInputFragment}
`);