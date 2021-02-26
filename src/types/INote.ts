import { UUID } from '.';

export interface INote {

   /** THe id of the note */
   id: UUID;

   /** The id of the object the note was made for */
   entityId: UUID;

   /** The id of the user that created the note */
   createdBy: UUID;

   /** The date and time the note was created */
   createdDate: number;

   /** The note's text */
   text: string;

}

export type INoteInput = Omit<INote, 'id' | 'entityType' | 'createdBy' | 'createdDate'>

export function noteToNoteInput(note: INote): INoteInput {
   const { id, createdBy, createdDate, ...noteInput } = note;
   return noteInput;
}

export function noteInputToNote(noteInput: INoteInput, id: UUID, createdBy: UUID, createdDate: number): INote {
   return {
      ...noteInput,
      id,
      createdBy,
      createdDate
   };
}
