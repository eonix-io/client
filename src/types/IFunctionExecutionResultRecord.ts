import { UUID } from '.';

/** A record of a past function execution */
export interface IFunctionExecutionResultRecord {
   /** A unique id of the exact execution */
   id: UUID;
   /** The id of the function that was executed */
   functionId: UUID;
   /** The id of the board the function belongs to */
   boardId: UUID;
   /** The date and time of the execution */
   createdDate: number;
   /** The id of the user that initiated the function execution */
   createdBy: UUID;
   /** An indicator of whether the execution was successful */
   success: boolean;
   /** The duration of the execution in milliseconds */
   duration: number;
}