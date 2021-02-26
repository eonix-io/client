import { gql } from '@apollo/client/core';

export const uxFragment = gql`
   fragment UxFragment on Ux {
      id
      boardId
      name
      description
      sections: sectionsJson
      openAccess
      createdBy
      createdDate
   }
`;