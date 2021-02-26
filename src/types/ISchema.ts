
import { UUID } from '.';
import { deepClone } from '../services';
import { IInputBase } from './schemaInputs';

export interface ISchema<AppDataType = any> {
    id: UUID;
    name: string;
    createdBy: UUID;
    createdDate: number;
    inputs: IInputBase[];
    appData: AppDataType | null;
}

export type ISchemaInput<AppDataType = any> = Omit<ISchema<AppDataType>, 'createdBy' | 'createdDate' | 'inputs'>

export function schemaToSchemaInput<AppDataType = any>(schema: ISchema<AppDataType>): { schemaInput: ISchemaInput<AppDataType>, inputs: IInputBase[] } {
    const { createdBy, createdDate, inputs, ...schemaInput } = schema;
    return { schemaInput, inputs };
}

/** Takes values used to update a schema can converts them back to a ISchema object. */
export function schemaInputToSchema<AppDataType = any>(schemaInput: ISchemaInput<AppDataType>, inputs: IInputBase[], createdBy: UUID, createdDate: number): ISchema<AppDataType> {
    return {
        ...schemaInput,
        inputs: deepClone(inputs),
        createdBy,
        createdDate
    };
}


