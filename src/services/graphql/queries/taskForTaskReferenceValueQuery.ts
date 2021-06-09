

import { DocumentNode, parse } from 'graphql';
import { QueryOptions } from '../..';
import { ITask, UUID } from '../../../types';
import { taskFragment } from '../fragments';


let _query: DocumentNode | undefined;
export function taskForTaskReferenceValueQuery<AppDataType = any, ValueAppDataType = any>(valueId: UUID): QueryOptions<{ valueId: UUID }, { taskForTaskReferenceValue: ITask<AppDataType, ValueAppDataType> | null }> {
   const query = _query ??= parse(`
      query taskForTaskReferenceValue($valueId: String!) { 
         taskForTaskReferenceValue(valueId: $valueId) { 
               ...TaskFragment
         } 
      }

      ${taskFragment}
   `);

   return {
      query,
      variables: { valueId }
   };
}