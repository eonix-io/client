import { IFunctionServiceResult, IFunctionVariableResult } from './IFunctionParameterResult';
import { UUID } from './UUID';

interface IFunctionExecutionResult {
   id: UUID;
   success: boolean;
   parameterResults: (IFunctionServiceResult | IFunctionVariableResult)[];
   functionId: UUID;
   /** The time the function started running */
   createdDate: number;
   /** The authenticated user that initiated the run */
   createdBy: UUID;
   /** How long the function took to run, in milliseconds */
   duration: number;
}

export interface IFunctionExecutionResultSuccess extends IFunctionExecutionResult {
   success: true;
   functionResult: any
}

export interface IFunctionExecutionResultFailure extends IFunctionExecutionResult {
   success: false;
   error: string;
}
