import { parse } from 'graphql';

export const userFragment = parse(`
   fragment UserFragment on User {
      id, 
      name,
      email,
      avatarUrl,
      createdDate,
      status
   }
`);