import { UUID } from '..';

export enum ValueType {
    Scalar = 'scalar',
    File = 'file',
    List = 'list',
    /** A link to another task */
    TaskReference = 'taskReference'
}

export interface IValueBase<AppDataType = any> {
    readonly id: UUID;
    readonly inputId: UUID;
    readonly type: ValueType;
    appData: AppDataType | null;
}