import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';

import { ITask, UUID } from '../../../types';
import { taskFragment } from '../fragments';


let _query: TypedDocumentNode | undefined;
export function taskForTaskReferenceValueQuery(valueId: UUID): QueryOptions<{ valueId: UUID }, { taskForTaskReferenceValue: ITask | null }> {
   const query = _query ??= gql`
      query taskForTaskReferenceValue($valueId: String!) { 
         taskForTaskReferenceValue(valueId: $valueId) { 
               ...TaskFragment
         } 
      }

      ${taskFragment}
   `;

   return {
      query,
      variables: { valueId }
   };
}