import { FunctionServiceParameter, FunctionVariableParameter } from '.';
import { isFunctionVariableParameter, isFunctionServiceParameter } from './IFunction';

interface IFunctionParameterResult {
   parameter: FunctionServiceParameter | FunctionVariableParameter;
}

export interface IFunctionVariableResult extends IFunctionParameterResult {
   parameter: FunctionVariableParameter;
   providedValue: any;
}

export interface IFunctionServiceResult extends IFunctionParameterResult {
   parameter: FunctionServiceParameter;
   inputParameters: any[] | null;
   duration: number;
   result?: any;
}

export function isFunctionVariableResult(result: IFunctionParameterResult): result is IFunctionVariableResult {
   return isFunctionVariableParameter(result.parameter);
}

export function isFunctionServiceResult(result: IFunctionParameterResult): result is IFunctionServiceResult {
   return isFunctionServiceParameter(result.parameter);
}