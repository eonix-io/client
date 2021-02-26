import { gql } from '@apollo/client/core';

export const noteFragment = gql`
   fragment NoteFragment on Note {
      id
      entityId
      text
      createdDate
      createdBy
   }
`;