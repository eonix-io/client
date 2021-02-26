import { UUID } from './UUID';

export interface IFunctionExecutionSummary {

   id: UUID;
   functionId: UUID;
   success: boolean;
   duration: number;
   result?: any;

}