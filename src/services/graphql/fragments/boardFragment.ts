import { parse } from 'graphql';


export const boardFragment = parse(`
    fragment BoardFragment on Board {
        id, 
        name, 
        schemaId, 
        createdDate,
        appData
    }
`);