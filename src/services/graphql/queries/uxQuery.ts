

import { DocumentNode, parse } from 'graphql';
import { QueryOptions } from '../..';
import { IUx, UUID } from '../../../types';
import { uxFragment } from '../fragments';


let _query: DocumentNode | undefined;
export function uxQuery(uxId: UUID): QueryOptions<{ uxId: UUID }, { ux: IUx | null }> {
   const query = _query ??= parse(`
      query ux($uxId: String!) {
         ux(uxId: $uxId) {
            ...UxFragment
         }
      }

      ${uxFragment}
   `);

   return {
      query,
      variables: { uxId }
   };
}