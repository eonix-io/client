
import { UUID } from '.';
import { IUserFull } from './IUser';

export enum GrantClaim {

   /** Allows full access to every feature of the board regardless of individual claims assigned */
   Admin = 'admin',
   /** Allows the user to get a list of all tasks on a board */
   TaskList = 'task_list',
   /** Allows the user to add/edit/delete users */
   UserManager = 'user_manager',
   /** Allows the user to add/edit/delete functions */
   Developer = 'developer',
   /** Allows the user to add/edit/delete user interfaces (UX) */
   UxDesigner = 'ux_designer',
   /** Allows user to make changes to the board's schema */
   SchemaEditor = 'schema_editor'
}

export enum GrantEntityType {
   //We're using an enum to support Api keys and UserGroups later on
   User = 'user'
}

export interface IGrant {
   id: UUID;
   boardId: UUID;
   entityType: GrantEntityType;
   entityId: UUID;
   claims: GrantClaim[];
   /** A list of closed UX Ids that the user has access to */
   uxIds: UUID[];
   createdDate: number;
   createdBy: UUID;
}

export interface IGrantFull extends IGrant {
   entity: IUserFull
}

export type IGrantInput = Omit<IGrant, 'createdBy' | 'createdDate'>

export function grantToGrantInput(grant: IGrant): IGrantInput {

   return {
      id: grant.id,
      boardId: grant.boardId,
      claims: [...grant.claims],
      entityId: grant.entityId,
      entityType: grant.entityType,
      uxIds: grant.uxIds
   };

}

export function grantInputToGrant(grantInput: IGrantInput, createdBy: UUID, createdDate: number): IGrant {

   return {
      id: grantInput.id,
      boardId: grantInput.boardId,
      claims: [...grantInput.claims],
      entityId: grantInput.entityId,
      entityType: grantInput.entityType,
      uxIds: grantInput.uxIds,
      createdBy,
      createdDate
   };

}