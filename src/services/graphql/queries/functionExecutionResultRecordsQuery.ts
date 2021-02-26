import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client/core';
import { IFunctionExecutionResultRecord, UUID } from '../../../types';

let _query: TypedDocumentNode | undefined;
export function functionExecutionResultRecordsQuery(functionId: UUID): QueryOptions<{ functionId: UUID }, { functionExecutionResultRecords: IFunctionExecutionResultRecord[] }> {
   const query = _query ??= gql`
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
   `;

   return {
      query,
      variables: { functionId }
   };
}