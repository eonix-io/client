import { DocumentNode, parse } from 'graphql';
import { noteFragment } from '..';
import { QueryOptions } from '../..';
import { INote, UUID } from '../../../types';

type QueryResult = { notesForEntity: INote[] };
type QueryVariables = { entityId: string };

let _query: DocumentNode | undefined;
export function notesForEntityQuery(entityId: UUID): QueryOptions<QueryVariables, QueryResult> {

   const query = _query ??= parse(`

      query notesForEntity($entityId: String!) {
         notesForEntity(entityId: $entityId) {
            ...NoteFragment
         }
      }

      ${noteFragment}
   `);

   return {
      query,
      variables: { entityId }
   };
}
