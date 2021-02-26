import { IValueBase, ValueType } from './IValueBase';

export interface IFileValue extends IValueBase {
    readonly type: ValueType.File;
    value: IFileProperties
}

export interface IFileProperties {
    name: string;
    length: number;
    path: string;
}

export function isFileValue(input: IValueBase): input is IFileValue {
    return input.type === ValueType.File;
}