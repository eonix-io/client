import { InputType, IInputBase } from './IInputBase';
import { UUID } from '..';
import { ITextValueOptions } from './ITextValueOption';

export interface IChecklistInput extends IInputBase {
   id: UUID;
   name: string;
   options: ITextValueOptions
   readonly type: InputType.Checklist;
}

export function isChecklistInput(input: IInputBase): input is IChecklistInput {
   return input.type == InputType.Checklist;
}