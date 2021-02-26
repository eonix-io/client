import { IInputBase, InputType } from './IInputBase';

import { UUID } from '..';

export interface IBooleanInput extends IInputBase {

    id: UUID;
    name: string;
    readonly type: InputType.Boolean;
}

export function isBooleanInput(input: IInputBase): input is IBooleanInput {
    return input.type === InputType.Boolean;
}