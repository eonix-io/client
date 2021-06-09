import { parse } from 'graphql';

export const noteFragment = parse(`
   fragment NoteFragment on Note {
      id
      entityId
      text
      createdDate
      createdBy
   }
`);