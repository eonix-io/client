import { UUID } from '.';
import { isScalarValue, isFileValue, IScalarValue, IFileValue, IListValue, isListValue, ITaskReferenceValue, isTaskReferenceValue, IValue } from './taskValues';
import { ITextInput, ISelectInput, IBooleanInput, IFileInput, isTextInput, isSelectInput, isBooleanInput, isFileInput, IChecklistInput, isChecklistInput, ITaskReferenceInput, isTaskReferenceInput, IInput } from './schemaInputs';
import { deepClone } from '../services';

export interface ITaskSortInput {
    taskId: UUID;
    sort: number | null;
}

export interface ITask {

    id: UUID;
    boardId: UUID;
    sort: number | null;
    createdBy: UUID;
    createdDate: number;
    values: IValue[];

    /** Additional schema that is additional to the Board's schema but specific to this Task */
    taskSchema: ITaskSchema | null;

    /** If the task was created from a foreign board, the details of the source board/delegate */
    sourceDelegate?: {

        /** The id of the delegate that authorized creation of the task */
        id: UUID;

        /** The id of the delegated board */
        boardId: UUID;

        /** The id of the task of the delegated board that created the task */
        taskId: UUID;

    } | null
}

export interface ITaskInput {
    id: UUID;
    boardId: UUID;
    sort: number | null;

    scalarValues?: IScalarValue[] | null;
    fileValues?: IFileValue[] | null;
    listValues?: IListValue[] | null;
    taskReferenceValues?: ITaskReferenceValue[] | null;

    taskSchema: ITaskSchemaInput | null;

    sourceDelegate?: ITask['sourceDelegate']
}

/** Lists additional inputs that can be added to a specific task */
export interface ITaskSchema {

    inputs: IInput[];

}

export interface ITaskSchemaInput {

    /** A list of the input ids in the order they should be presented */
    inputOrder: UUID[];

    textInputs?: ITextInput[] | null;
    selectInputs?: ISelectInput[] | null;
    booleanInputs?: IBooleanInput[] | null;
    fileInputs?: IFileInput[] | null;
    checklistInputs?: IChecklistInput[] | null;
    taskReferenceInputs?: ITaskReferenceInput[] | null;

}

export function taskToTaskInput(task: ITask): ITaskInput {

    const { scalarValues, fileValues, listValues, taskReferenceValues } = taskValuesToValueInputs(task.values);
    const taskSchema = taskSchemaToSchemaInput(task.taskSchema);

    const input: ITaskInput = {
        id: task.id,
        boardId: task.boardId,
        sort: task.sort,
        scalarValues,
        fileValues,
        listValues,
        taskSchema,
        taskReferenceValues,
        sourceDelegate: task.sourceDelegate
    };

    return input;

}

function taskValuesToValueInputs(values: IValue[]): { scalarValues: IScalarValue[], fileValues: IFileValue[], listValues: IListValue[], taskReferenceValues: ITaskReferenceValue[] } {

    const fileValues: IFileValue[] = [];
    const scalarValues: IScalarValue[] = [];
    const listValues: IListValue[] = [];
    const taskReferenceValues: ITaskReferenceValue[] = [];

    values.forEach(v => {
        const clone = deepClone(v);

        if (isScalarValue(clone)) {
            scalarValues.push(clone);
        } else if (isFileValue(clone)) {
            fileValues.push(clone);
        } else if (isListValue(clone)) {
            listValues.push(clone);
        } else if (isTaskReferenceValue(clone)) {
            taskReferenceValues.push(clone);
        } else {
            const _exhaustiveCheck: never = clone;
        }
    });

    return {
        scalarValues,
        fileValues,
        listValues,
        taskReferenceValues
    };

}

function taskSchemaToSchemaInput(schema: ITaskSchema | null): ITaskSchemaInput | null {
    if (!schema) { return schema; }

    const inputOrder: UUID[] = [];

    const textInputs: ITextInput[] = [];
    const selectInputs: ISelectInput[] = [];
    const booleanInputs: IBooleanInput[] = [];
    const fileInputs: IFileInput[] = [];
    const checklistInputs: IChecklistInput[] = [];
    const taskReferenceInputs: ITaskReferenceInput[] = [];

    schema.inputs.forEach(i => {
        const c = deepClone(i);
        if (isTextInput(c)) {
            textInputs.push(c);
        } else if (isSelectInput(c)) {
            selectInputs.push(c);
        } else if (isBooleanInput(c)) {
            booleanInputs.push(c);
        } else if (isFileInput(c)) {
            fileInputs.push(c);
        } else if (isChecklistInput(c)) {
            checklistInputs.push(c);
        } else if (isTaskReferenceInput(c)) {
            taskReferenceInputs.push(c);
        } else {
            const _exhaustiveCheck: never = c;
        }
        inputOrder.push(i.id);
    });

    return {
        inputOrder,
        textInputs,
        selectInputs,
        booleanInputs,
        fileInputs,
        checklistInputs,
        taskReferenceInputs
    };

}

export function taskInputToTask(taskInput: ITaskInput, createdBy: UUID, createdDate: number): ITask {

    const { scalarValues, fileValues, listValues, taskSchema, taskReferenceValues, ...taskBase } = taskInput;

    return {
        ...taskBase,
        values: [...scalarValues ?? [], ...fileValues ?? [], ...listValues ?? [], ...taskReferenceValues ?? []],
        taskSchema: taskSchemaInputToSchema(taskSchema),
        createdBy,
        createdDate,
        sourceDelegate: taskInput.sourceDelegate
    };
}

function taskSchemaInputToSchema(schemaInput: ITaskSchemaInput | null): ITaskSchema | null {
    if (!schemaInput) { return null; }

    const schema: ITaskSchema = {
        inputs: [
            ...schemaInput.booleanInputs ?? [],
            ...schemaInput.fileInputs ?? [],
            ...schemaInput.selectInputs ?? [],
            ...schemaInput.textInputs ?? [],
            ...schemaInput.checklistInputs ?? [],
            ...schemaInput.taskReferenceInputs ?? []
        ]
    };

    schema.inputs.sort((a, b) => {
        const aIndex = schemaInput.inputOrder.indexOf(a.id);
        const bIndex = schemaInput.inputOrder.indexOf(b.id);
        return aIndex - bIndex;
    });

    return deepClone(schema);
}

