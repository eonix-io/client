import { parse } from 'graphql';
import { DocumentNode } from 'graphql';
import { noteFragment, notesForEntityQuery } from '..';
import { INoteInput, noteInputToNote } from '../../../types';
import { deepClone } from '../../deepClone';
import { uuidEmpty } from '../../uuid';
import { EonixClient } from '../../EonixClient';

let mutation: DocumentNode | undefined;
export async function addNoteMutation(eonixClient: EonixClient, noteInput: INoteInput): Promise<void> {

   if (!mutation) {
      mutation = parse(`
         mutation addNote($note: NoteInput!) {
            addNote(note: $note) {
               ...NoteFragment
            }
         }

         ${noteFragment}
      `);
   }

   const variables = {
      note: noteInput
   };

   const optimisticResponse = {
      addNote: {
         __typename: 'Note',
         ...noteInputToNote(noteInput, uuidEmpty, eonixClient.tokenUserId, Date.now())
      }
   };

   await eonixClient.mutate({
      mutation,
      variables,
      optimisticResponse,
      update(store, fetchResult) {
         console.assert(fetchResult.data?.addNote);
         const addNote = fetchResult.data!.addNote;

         const query = notesForEntityQuery(addNote.entityId);
         const forEntityData = store.readQuery(query);

         if (forEntityData) {

            const newData = deepClone(forEntityData);
            newData.notesForEntity.push(addNote);

            store.writeQuery({ ...query, data: newData });
         }

      }

   });

}