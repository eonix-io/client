
import { UUID } from '.';
import { deepClone } from '../services';
import { IInputBase } from './schemaInputs';

export interface ISchema<AppDataType = any, InputDataType = any> {
    id: UUID;
    name: string;
    createdBy: UUID;
    createdDate: number;
    inputs: IInputBase<InputDataType>[];
    appData: AppDataType | null;
}

export type ISchemaInput<AppDataType = any> = Omit<ISchema<AppDataType>, 'createdBy' | 'createdDate' | 'inputs'>

export function schemaToSchemaInput<AppDataType = any, InputDataType = any>(schema: ISchema<AppDataType, InputDataType>): { schemaInput: ISchemaInput<AppDataType>, inputs: IInputBase<InputDataType>[] } {
    const { createdBy, createdDate, inputs, ...schemaInput } = schema;
    return { schemaInput, inputs };
}

/** Takes values used to update a schema can converts them back to a ISchema object. */
export function schemaInputToSchema<SchemaAppData = any, InputAppData = any>(schemaInput: ISchemaInput<SchemaAppData>, inputs: IInputBase<InputAppData>[], createdBy: UUID, createdDate: number): ISchema<SchemaAppData, InputAppData> {
    return {
        ...schemaInput,
        inputs: deepClone(inputs),
        createdBy,
        createdDate
    };
}


