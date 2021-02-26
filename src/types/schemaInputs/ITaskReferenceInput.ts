import { InputType, IInputBase } from './IInputBase';
import { UUID } from '..';

export interface ITaskReferenceInput extends IInputBase {
   id: UUID;
   name: string;
   /** A non-empty list of the boardIds that the task can be created for */
   destinationBoardIds: UUID[]
   readonly type: InputType.TaskReference;
}

export function isTaskReferenceInput(input: IInputBase): input is ITaskReferenceInput {
   return input.type === InputType.TaskReference;
}