import { InputType, IInputBase } from '.';
import { UUID } from '..';

export interface IFileInput extends IInputBase {
    id: UUID;
    name: string;
    options: IFileInputOptions;
    readonly type: InputType.File;
}

export interface IFileInputOptions {
    /** A list of acceptable file extensions. Eg, ['pdf', 'png']. To accept all, leave as an empty array. */
    extensions: string[];
    /** The max size, in bytes, of the file */
    maxLength: number | null;

}

export function isFileInput(input: IInputBase): input is IFileInput {
    return input.type === InputType.File;
}