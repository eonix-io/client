import { InputType, IInputBase } from './IInputBase';
import { UUID } from '..';
import { ITextValueOptions } from './ITextValueOption';

export interface ISelectInput extends IInputBase {
    id: UUID;
    name: string;
    options: ITextValueOptions
    readonly type: InputType.Select;
}

export function isSelectInput<T = any>(input?: IInputBase<T> | null): input is ISelectInput {
    return input?.type === InputType.Select;
}