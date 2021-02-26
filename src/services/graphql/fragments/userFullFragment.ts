import { gql } from '@apollo/client/core';
import { userFragment } from './userFragment';

export const userFullFragment = gql`
    fragment UserFullFragment on User {
        ...UserFragment,
        emailMd5
    }

    ${userFragment}
`;