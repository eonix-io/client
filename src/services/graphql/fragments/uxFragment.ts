import { parse } from 'graphql';

export const uxFragment = parse(`
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
`);