import { UUID } from './UUID';

export interface IBoardCopyOptions {
   newBoardId: UUID;
   newBoardName: string;
   grants: boolean;
   tasks: boolean;
   functions: boolean;
   uxs: boolean;

}