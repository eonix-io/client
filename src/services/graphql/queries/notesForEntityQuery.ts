import { gql } from '@apollo/client/core';
import type { QueryOptions, TypedDocumentNode } from '@apollo/client/core';
import { noteFragment } from '..';
import { INote, UUID } from '../../../types';

type QueryResult = { notesForEntity: INote[] };
type QueryVariables = { entityId: string };

let _query: TypedDocumentNode | undefined;
export function notesForEntityQuery(entityId: UUID): QueryOptions<QueryVariables, QueryResult> {

   const query = _query ??= gql`

      query notesForEntity($entityId: String!) {
         notesForEntity(entityId: $entityId) {
            ...NoteFragment
         }
      }

      ${noteFragment}
   `;

   return {
      query,
      variables: { entityId }
   };
}
