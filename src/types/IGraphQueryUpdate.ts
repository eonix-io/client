import { UUID } from '.';

export enum UpdateType {
   Add,
   Update,
   Delete
}

export interface IGraphQueryUpdateQuery {
   name: string;
   type: UpdateType;
   variables?: { [key: string]: any }
}

export interface IGraphQueryUpdate {
   byId: UUID;
   sessionId: UUID | null;
   timestamp: number;
   queries: IGraphQueryUpdateQuery[];
}