import { UUID } from '.';

export enum FunctionType {
   /** An action that is meant to change data. Executions of actions are not reported through SignalR */
   Action = 'action',
   /** An action that provides data to a thing */
   DataSource = 'dataSource'
}

export interface IFunction {
   id: UUID;
   boardId: UUID;
   name: string;
   description: string | null;
   code: string;
   parameters: (FunctionServiceParameter | FunctionVariableParameter)[];
   type: FunctionType
   createdBy: UUID;
   createdDate: number;
}

export type IFunctionInput = Omit<IFunction, 'createdBy' | 'createdDate'>

export enum FunctionServiceParameter {
   /** Gets a list of tasks for the function's board. Usage $getTasks(): Promise<ITask[]> */
   getTasks = '$getTasks',
   /** Saves a task(s). Usage $putTask(...tasks: ITask[]): Promise<ITask[]> */
   putTask = '$putTask',
   /** Saves a file for a task input and returns a absolute uri for the saved file. Usage $putTaskFile(taskId: UUID, inputId: UUID, refType: 'task' | 'markdown', fileName: string, content: Readable): Promise<string> */
   putTaskFile = '$putTaskFile',
   /** Returns a list of grants for the function's board. Usage $getGrants(): Promise<IGrant[]> */
   getGrants = '$getGrants',
   /** Returns the schema assigned to the function's board. Usage $getSchema(): Promise<ISchema | null> */
   getSchema = '$getSchema',
   /** Returns a new unique id to be used a mew object's id field */
   getNewId = '$getNewId',
   /** Log a message for debugging purposes. Usage $log('Item was saved') */
   log = '$log',
   /** Make a http request. The api of the $http service follows that of axios. Usage $http({ method: 'POST', url: 'https://example.com', data: { data: 'fooBar'} }).then(r => r.data) */
   http = '$http',
}

export enum FunctionVariableParameter {
   UserId = '_userId',
   BoardId = '_boardId',
   Now = '_now'
}

export function isFunctionVariableParameter(value: string): value is FunctionVariableParameter {
   return (Object.values(FunctionVariableParameter) as string[]).includes(value);
}

export function isFunctionServiceParameter(value: string): value is FunctionServiceParameter {
   return (Object.values(FunctionServiceParameter) as string[]).includes(value);
}
