import { UUID } from '..';

export enum TextValueOptionsType {
   Static = 'static',
   Function = 'function'
}

export interface ITextValueOptions {
   optionsType: TextValueOptionsType;
   options: ITextValueOption[] | null;
   functionId: UUID | null
}

export interface ITextValueOption {
   value: string;
   text: string;
}