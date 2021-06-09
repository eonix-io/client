
import { DocumentNode, parse } from 'graphql';
import { QueryOptions } from '../..';
import { IFunctionExecutionSummary, UUID } from '../../../types';

let _query: DocumentNode | undefined;
export function functionExecuteQuery(functionId: UUID): QueryOptions<{ functionId: UUID }, { functionExecute: IFunctionExecutionSummary | null }> {
   const query = _query ??= parse(`
      query functionExecute($functionId: String!) {
         functionExecute(functionId: $functionId) {
            id
            functionId
            success
            duration
            result
         }
      }
   `);

   return {
      query,
      variables: { functionId }
   };
}