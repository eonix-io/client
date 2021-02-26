import { gql } from '@apollo/client/core';

export const userFragment = gql`
   fragment UserFragment on User {
      id, 
      name,
      email,
      avatarUrl,
      createdDate,
      status
   }
`;