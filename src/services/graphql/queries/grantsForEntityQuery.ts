
import { DocumentNode, parse } from 'graphql';
import { grantFullFragment, QueryOptions } from '../..';
import { IGrantFull, UUID } from '../../../types';


let _query: DocumentNode | undefined;
export function grantsForEntityQuery(entityId: UUID): QueryOptions<{ entityId: UUID }, { grantsForEntity: IGrantFull[] }> {
   const query = _query ??= parse(`
      query grantsForEntity($entityId: String!) {
         grantsForEntity(entityId: $entityId) {
            ...GrantFullFragment
         }
      }

      ${grantFullFragment}
   `);

   return {
      query,
      variables: { entityId }
   };
}