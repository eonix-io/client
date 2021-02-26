import { UUID } from '..';

export enum ValueType {
    Scalar = 'scalar',
    File = 'file',
    List = 'list',
    /** A link to another task */
    TaskReference = 'taskReference'
}

export const VALUE_METADATA_MAX_SIZE = 5000;

/** Call to check that the JSON serialized metadata is within the allowable 5kB */
export function isValueMetadataWithinLimit(metadata?: Record<string, any> | null): boolean {
    if (!metadata) { return true; }
    if (JSON.stringify(metadata).length > VALUE_METADATA_MAX_SIZE) { return false; }
    return true;
}

export interface IValueBase {
    readonly id: UUID;
    readonly inputId: UUID;
    readonly type: ValueType;

    /** Optional key/value store for any needed metadata. Max JSON serialized length of 5kB */
    metadata: Record<string, any> | null;
}