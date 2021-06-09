import { parse } from 'graphql';

export const functionFragment = parse(`
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
`);