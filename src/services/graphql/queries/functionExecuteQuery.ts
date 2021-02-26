import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';
import { IFunctionExecutionSummary, UUID } from '../../../types';

let _query: TypedDocumentNode | undefined;
export function functionExecuteQuery(functionId: UUID): QueryOptions<{ functionId: UUID }, { functionExecute: IFunctionExecutionSummary | null }> {
   const query = _query ??= gql`
      query functionExecute($functionId: String!) {
         functionExecute(functionId: $functionId) {
            id
            functionId
            success
            duration
            result
         }
      }
   `;

   return {
      query,
      variables: { functionId }
   };
}