import { UUID } from '..';

//IF we add any new ones, make sure to add to ITask's schema as well
export enum InputType {
    Text = 'text',
    Boolean = 'boolean',
    Select = 'select',
    File = 'file',
    Checklist = 'checklist',
    TaskReference = 'taskReference'
}

export interface IInputBase {
    id: UUID;
    name: string;
    type: InputType;
}