import { IValueBase, ValueType } from './IValueBase';

export interface IListValue<AppDataType = any> extends IValueBase<AppDataType> {
   readonly type: ValueType.List;
   values: string[];
}

export function isListValue(input: IValueBase): input is IListValue {
   return input.type === ValueType.List;
}