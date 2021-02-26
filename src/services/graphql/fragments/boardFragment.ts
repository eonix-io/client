import { gql } from '@apollo/client/core';

export const boardFragment = gql`
    fragment BoardFragment on Board {
        id, 
        name, 
        schemaId, 
        createdDate,
        appData
    }
`;