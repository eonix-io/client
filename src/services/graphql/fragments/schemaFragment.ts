import { gql } from '@apollo/client/core';

import { schemaInputFragment } from './schemaInputFragment';

export const schemaFragment = gql`
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
`;