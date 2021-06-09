import { parse } from 'graphql';

export const schemaInputFragment = parse(`
    fragment SchemaInputFragment on Input {
        id
        name
        type
        appData
        ... on TextInput {
            options {
                type
                maxLength
            }
        },
        ... on SelectInput {
            options {
                optionsType
                functionId
                options {
                    value
                    text
                }
            }
        }
        ... on FileInput {
            options {
                extensions
                maxLength
            }
        }
        ... on ChecklistInput {
            options {
                optionsType
                functionId
                options {
                    value
                    text
                }
            }
        }
        ... on TaskReferenceInput {
            destinationBoardIds
        }
    }
`);