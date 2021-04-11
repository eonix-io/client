import { IInputBase, InputType } from './IInputBase';

import { UUID } from '..';

export interface IBooleanInput extends IInputBase {

    id: UUID;
    name: string;
    readonly type: InputType.Boolean;
}

export function isBooleanInput<T = any>(input?: IInputBase<T> | null): input is IBooleanInput {
    return input?.type === InputType.Boolean;
}