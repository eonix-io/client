
import { DocumentNode, parse } from 'graphql';
import { QueryOptions } from '../..';
import { IFunctionExecutionResultRecord, UUID } from '../../../types';

let _query: DocumentNode | undefined;
export function functionExecutionResultRecordsQuery(functionId: UUID): QueryOptions<{ functionId: UUID }, { functionExecutionResultRecords: IFunctionExecutionResultRecord[] }> {
   const query = _query ??= parse(`
      query functionExecutionResultRecords($functionId: String!) { 
         functionExecutionResultRecords(functionId: $functionId) { 
               id
               functionId
               boardId
               createdDate
               createdBy
               success
               duration
         } 
      }
   `);

   return {
      query,
      variables: { functionId }
   };
}