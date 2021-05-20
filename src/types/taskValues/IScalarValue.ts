import { IValueBase, ValueType } from './IValueBase';

export interface IScalarValue<AppDataType = any> extends IValueBase<AppDataType> {
    readonly type: ValueType.Scalar;
    value: IScalarValueValue
}

export interface IScalarValueValue {
    type: 'string' | 'number' | 'boolean';
    value: string | null;
}

export function isScalarValue(input: IValueBase): input is IScalarValue {
    return input.type === ValueType.Scalar;
}