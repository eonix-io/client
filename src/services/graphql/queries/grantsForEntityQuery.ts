import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';
import { grantFullFragment } from '../..';
import { IGrantFull, UUID } from '../../../types';


let _query: TypedDocumentNode | undefined;
export function grantsForEntityQuery(entityId: UUID): QueryOptions<{ entityId: UUID }, { grantsForEntity: IGrantFull[] }> {
   const query = _query ??= gql`
      query grantsForEntity($entityId: String!) {
         grantsForEntity(entityId: $entityId) {
            ...GrantFullFragment
         }
      }

      ${grantFullFragment}
   `;

   return {
      query,
      variables: { entityId }
   };
}