
import { DocumentNode, parse } from 'graphql';
import { schemaInputFragment } from '../..';
import { IDelegateBoard, UUID } from '../../../types';
import { IQueryOptions } from '../client/IQueryOptions';


let _query: DocumentNode | undefined;
export function boardForDelegateQuery(delegateId: UUID): IQueryOptions<{ delegateId: UUID }, { boardForDelegate: IDelegateBoard | null }> {
   const query = _query ??= parse(`

      query boardForDelegate($delegateId: String!) { 
         boardForDelegate(delegateId: $delegateId) { 
            id
            name
            delegateId
            schemaInputs {
               ...SchemaInputFragment
            }
         }
      }

      ${schemaInputFragment}
   `);

   return {
      query,
      variables: { delegateId }
   };
}