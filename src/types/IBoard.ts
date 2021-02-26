import { UUID } from '.';
import { IInputBase } from './schemaInputs';

export interface IBoard<AppDataType = any> {
    id: UUID;
    schemaId: UUID | null;
    name: string;
    createdDate: number;
    appData: AppDataType | null;
}

export type IBoardInput<T = any> = Omit<IBoard<T>, 'createdDate'>

export interface IDelegateBoard extends Pick<IBoard, 'id' | 'name'> {
    delegateId: UUID;
    /** A list of inputs that are not hidden */
    schemaInputs: IInputBase[];
}

export function boardToBoardInput<T = any>(board: IBoard<T>): IBoardInput<T> {
    const { createdDate, ...boardInput } = board;
    return boardInput;
}

export function boardInputToBoard<T = any>(boardInput: IBoardInput<T>, createdDate: number): IBoard<T> {
    return {
        ...boardInput,
        createdDate
    };
}