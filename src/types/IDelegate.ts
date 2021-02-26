
import { UUID } from './UUID';

export enum AccessLevel {
   Hidden = 'hidden',
   Read = 'read',
   ReadWrite = 'readWrite'
}

export interface IDelegate {
   id: UUID,
   /** The id of the board that is giving access - the source board */
   boardId: UUID;
   /** The id of the board that is delegated access */
   delegateBoardId: UUID;
   /** When true, the delegate is able to get a list of existing tasks. Otherwise, delegates are only able to see the tasks they created */
   canList: boolean;
   /** The default access level for inputs not explicitly listed. Leaving defaultAccess set to null is the same as hidden/no access */
   defaultInputAccess: AccessLevel | null
   inputAccess: IDelegateInputAccess[];
   createdBy: UUID;
   createdDate: number;
}

export interface IDelegateBoardDetail {
   name: string;
}

export interface IDelegateFull extends IDelegate {
   boardDetail: IDelegateBoardDetail,
   delegateBoardDetail: IDelegateBoardDetail
}

export type IDelegateInput = Omit<IDelegate, 'createdBy' | 'createdDate'>


export interface IDelegatePending extends Omit<IDelegate, 'delegateBoardId'> {
   token: string;
   name: string;
}


export interface IDelegatePendingFull extends IDelegatePending {
   boardDetail: IDelegateBoardDetail,
}

export type IDelegatePendingInput = Omit<IDelegatePending, 'createdBy' | 'createdDate'>

export interface IDelegateInputAccess {
   inputId: UUID;
   access: AccessLevel;
}

export type DelegateOrPending = IDelegate | IDelegatePending;
export type DelegateOrPendingFull = IDelegateFull | IDelegatePendingFull;

export type DelegateOrPendingInput = IDelegateInput | IDelegatePendingInput;

export function isDelegatePending(delegate: DelegateOrPending): delegate is IDelegatePending {
   if ((delegate as IDelegatePending).token) { return true; }
   return false;
}

export function isDelegate(delegate: DelegateOrPending): delegate is IDelegate {
   return !isDelegatePending(delegate);
}

export function delegateToDelegateInput(delegate: IDelegate): IDelegateInput;
export function delegateToDelegateInput(delegate: IDelegatePending): IDelegatePendingInput;
export function delegateToDelegateInput(delegate: IDelegate | IDelegatePending): IDelegateInput | IDelegatePendingInput {
   if (isDelegate(delegate)) {
      const input: IDelegateInput = {
         id: delegate.id,
         boardId: delegate.boardId,
         canList: delegate.canList,
         defaultInputAccess: delegate.defaultInputAccess,
         delegateBoardId: delegate.delegateBoardId,
         inputAccess: delegate.inputAccess
      };
      return input;
   } else {
      const input: IDelegatePendingInput = {
         id: delegate.id,
         boardId: delegate.boardId,
         canList: delegate.canList,
         defaultInputAccess: delegate.defaultInputAccess,
         name: delegate.name,
         token: delegate.token,
         inputAccess: delegate.inputAccess
      };
      return input;
   }
}

export function delegateInputToDelegate(input: IDelegateInput, createdBy: UUID, createdDate: number): IDelegate;
export function delegateInputToDelegate(input: IDelegatePendingInput, createdBy: UUID, createdDate: number): IDelegatePending;
export function delegateInputToDelegate(input: IDelegateInput | IDelegatePendingInput, createdBy: UUID, createdDate: number): IDelegate | IDelegatePending {

   if ((input as IDelegateInput).delegateBoardId) {
      return {
         id: input.id,
         boardId: input.boardId,
         delegateBoardId: (input as IDelegateInput).delegateBoardId,
         canList: input.canList,
         defaultInputAccess: input.defaultInputAccess,
         inputAccess: input.inputAccess,
         createdBy,
         createdDate
      };
   } else if ((input as IDelegatePendingInput).token) {
      return {
         id: input.id,
         boardId: input.boardId,
         canList: input.canList,
         token: (input as IDelegatePendingInput).token,
         name: (input as IDelegatePendingInput).name,
         defaultInputAccess: input.defaultInputAccess,
         inputAccess: input.inputAccess,
         createdBy,
         createdDate
      };
   }
   throw new Error('Ambiguous input type');
}