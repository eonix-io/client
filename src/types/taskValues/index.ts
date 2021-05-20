
import { IFileValue } from './IFileValue';
import { IListValue } from './IListValue';
import { IScalarValue } from './IScalarValue';
import { ITaskReferenceValue } from './ITaskReferenceValue';

export * from './IValueBase';
export * from './IScalarValue';
export * from './IFileValue';
export * from './IListValue';
export * from './ITaskReferenceValue';

export type IValue<AppDataType = any> = IScalarValue<AppDataType> | IFileValue<AppDataType> | IListValue<AppDataType> | ITaskReferenceValue<AppDataType>;