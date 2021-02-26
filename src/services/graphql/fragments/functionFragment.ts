import { gql } from '@apollo/client/core';

export const functionFragment = gql`
   fragment FunctionFragment on Function {
      id
      boardId
      name
      description
      code
      parameters
      type
      createdBy
      createdDate 
   }
`;