
import { DocumentNode, parse } from 'graphql';
import { QueryOptions } from '../..';
import { IFunction, UUID } from '../../../types';
import { functionFragment } from '../fragments';


let _query: DocumentNode | undefined;
export function functionQuery(functionId: UUID): QueryOptions<{ functionId: UUID }, { function: IFunction | null }> {
   const query = _query ??= parse(`
      query function($functionId: String!) { 
         function(functionId: $functionId) { 
               ...FunctionFragment
         } 
      }

      ${functionFragment}
   `);

   return {
      query,
      variables: { functionId }
   };
}