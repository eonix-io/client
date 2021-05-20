import { UUID } from '..';

import { IValueBase, ValueType } from './IValueBase';

/** Details of a task that is linked to an existing task. Values cannot be changed once created. */
export interface ITaskReferenceValue<AppDataType = any> extends IValueBase<AppDataType> {
   readonly type: ValueType.TaskReference;
   /** The id of the remote task that this input value is referencing */
   readonly taskId: UUID;
   /** The id of the board the remote task belongs to */
   readonly boardId: UUID;
   /** If the task is for a foreign board, the delegateId that was used to create it */
   readonly delegateId: UUID | null;
}

export function isTaskReferenceValue(input: IValueBase): input is ITaskReferenceValue {
   return input.type === ValueType.TaskReference;
}