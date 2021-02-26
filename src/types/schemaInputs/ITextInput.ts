import { IInputBase, InputType } from './IInputBase';
import { UUID } from '..';


export interface ITextInput extends IInputBase {

    id: UUID;
    name: string;
    readonly type: InputType.Text;
    options: ITextOptions;

}

export enum TextType {
    Text = 'text',
    Number = 'number',
    MultiLine = 'textarea'
}

/** Returns a flat list of strings which represent the values of the InputType enum */
export const textTypes: TextType[] = Object.values(TextType).filter(value => typeof value === 'string');

export interface ITextOptions {
    type: TextType;
    maxLength: number | null;
}

export function isTextInput(input: IInputBase): input is ITextInput {
    return input.type === InputType.Text;
}