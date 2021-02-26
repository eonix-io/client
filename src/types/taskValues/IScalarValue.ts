import { IValueBase, ValueType } from './IValueBase';

export interface IScalarValue extends IValueBase {
    readonly type: ValueType.Scalar;
    value: IScalarValueValue
}

export interface IScalarValueValue {
    type?: 'string' | 'number' | 'boolean' | null;
    value: string | null;
}

export function isScalarValue(input: IValueBase): input is IScalarValue {
    return input.type === ValueType.Scalar;
}