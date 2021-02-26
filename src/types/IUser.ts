import { UUID } from './UUID';

export enum UserStatus {
    /** The use has not logged/in registered yet. Just a placeholder to tied default board to */
    Guest = 'guest',
    /** The user has registered but their email address has not yet been confirmed */
    Unverified = 'unverified',
    /** Email address verified */
    Active = 'active'
}

export interface IUser {
    id: UUID;
    email: string;
    name: string;
    avatarUrl: string | null;
    createdDate: number;
    status: UserStatus;
}

export interface IUserFull extends IUser {
    emailMd5: string;
}