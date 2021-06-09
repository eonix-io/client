import { parse } from 'graphql';

export const delegateFullFragment = parse(`
   fragment DelegateFullFragment on DelegateOrPending {
      ... on Delegate {
         id
         boardId
         boardDetail {
            name
         }
         inputAccess {
            inputId
            access
         }
         delegateBoardId
         delegateBoardDetail {
            name
         }
         canList,
         defaultInputAccess,
         createdBy
         createdDate
      }
      ... on DelegatePending {
         id
         boardId
         name
         boardDetail {
            name
         }
         inputAccess {
            inputId
            access
         }
         token,
         canList,
         defaultInputAccess,
         createdBy
         createdDate
      }
   }
`);