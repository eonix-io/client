import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';
import { IFunction, UUID } from '../../../types';
import { functionFragment } from '../fragments';


let _query: TypedDocumentNode | undefined;
export function functionQuery(functionId: UUID): QueryOptions<{ functionId: UUID }, { function: IFunction | null }> {
   const query = _query ??= gql`
      query function($functionId: String!) { 
         function(functionId: $functionId) { 
               ...FunctionFragment
         } 
      }

      ${functionFragment}
   `;

   return {
      query,
      variables: { functionId }
   };
}