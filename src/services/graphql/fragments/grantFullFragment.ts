import { gql } from '@apollo/client/core';
import { userFullFragment } from './userFullFragment';

export const grantFullFragment = gql`
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
`;