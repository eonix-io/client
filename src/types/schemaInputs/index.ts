import { IBooleanInput } from './IBooleanInput';
import { IChecklistInput } from './IChecklistInput';
import { IFileInput } from './IFileInput';
import { ISelectInput } from './ISelectInput';
import { ITaskReferenceInput } from './ITaskReferenceInput';
import { ITextInput } from './ITextInput';

export * from './IBooleanInput';
export * from './ITextInput';
export * from './ISelectInput';
export * from './IInputBase';
export * from './IFileInput';
export * from './IChecklistInput';
export * from './ITextValueOption';
export * from './ITaskReferenceInput';

export type IInput = IBooleanInput | ITextInput | ISelectInput | IFileInput | IChecklistInput | ITaskReferenceInput;