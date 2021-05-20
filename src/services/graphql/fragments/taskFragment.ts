import { gql } from '@apollo/client/core';
import { schemaInputFragment } from './schemaInputFragment';

export const taskFragment = gql`
    fragment TaskFragment on Task {
            id,
            boardId,
            sort,
            appData,
            values {
               id
               inputId
               type
               appData
               ... on ScalarValue {
                     value {
                        type
                        value
                     }
               }
               ... on FileValue {
                     value {
                        name
                        length
                        path
                     }
               }
               ... on ListValue {
                     values
               }
               ... on TaskReferenceValue {
                     taskId
                     boardId
                     delegateId
               }
            },
            taskSchema {
                inputs {
                    ...SchemaInputFragment
                }
            }
            createdDate,
            createdBy
    }

    ${schemaInputFragment}
`;