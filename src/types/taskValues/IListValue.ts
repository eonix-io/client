import { IValueBase, ValueType } from './IValueBase';

export interface IListValue extends IValueBase {
   readonly type: ValueType.List;
   values: string[];
}

export function isListValue(input: IValueBase): input is IListValue {
   return input.type === ValueType.List;
}