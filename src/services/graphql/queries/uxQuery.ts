import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';

import { IUx, UUID } from '../../../types';
import { uxFragment } from '../fragments';


let _query: TypedDocumentNode | undefined;
export function uxQuery(uxId: UUID): QueryOptions<{ uxId: UUID }, { ux: IUx | null }> {
   const query = _query ??= gql`
      query ux($uxId: String!) {
         ux(uxId: $uxId) {
            ...UxFragment
         }
      }

      ${uxFragment}
   `;

   return {
      query,
      variables: { uxId }
   };
}