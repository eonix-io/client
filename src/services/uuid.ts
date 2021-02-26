import { UUID } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function uuid(): UUID {
    return uuidv4() as UUID;
}

/** A empty UUID: '00000000-0000-0000-0000-000000000000' */
export const uuidEmpty: UUID = '00000000-0000-0000-0000-000000000000';