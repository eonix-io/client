import { parse } from 'graphql';
import { userFragment } from './userFragment';

export const userFullFragment = parse(`
    fragment UserFullFragment on User {
        ...UserFragment,
        emailMd5
    }

    ${userFragment}
`);