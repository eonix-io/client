import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';
import { schemaInputFragment } from '../..';
import { IDelegateBoard, UUID } from '../../../types';


let _query: TypedDocumentNode | undefined;
export function boardForDelegateQuery(delegateId: UUID): QueryOptions<{ delegateId: UUID }, { boardForDelegate: IDelegateBoard | null }> {
   const query = _query ??= gql`

      query boardForDelegate($delegateId: String!) { 
         boardForDelegate(delegateId: $delegateId) { 
            id
            name
            delegateId
            schemaInputs {
               ...SchemaInputFragment
            }
         }
      }

      ${schemaInputFragment}
   `;

   return {
      query,
      variables: { delegateId }
   };
}