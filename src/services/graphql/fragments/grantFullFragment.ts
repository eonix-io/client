import { parse } from 'graphql';
import { userFullFragment } from './userFullFragment';

export const grantFullFragment = parse(`
   fragment GrantFullFragment on Grant {
      id
      boardId
      entityType
      entityId
      claims
      uxIds
      entity {
         ... on User {
            ...UserFullFragment
         }
      }
      createdDate
      createdBy
   }

   ${userFullFragment}
`);