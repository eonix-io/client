import type { UUID } from '.';

export enum Widget {
   Section = 'section',
   Button = 'button',
   TaskBoard = 'taskBoard'
}

export type IWidget = IButtonWidget | ITaskBoardWidget | ISectionWidget;

//#region Button

export interface IButtonWidget {
   type: Widget.Button;
   text: string | null;
   tooltip: string | null;
   functionId: UUID | null;
}

export type IButtonWidgetInput = Omit<IButtonWidget, 'type'>

//#endregion

//#region TaskBoard

export interface ITaskBoardWidget {
   type: Widget.TaskBoard;
   dataSourceId: UUID | null;
}

export type ITaskBoardWidgetInput = Omit<ITaskBoardWidget, 'type'>

//#endregion

//#region Section

export enum DivisionWidth {
   Minimum = 'minimum',
   Equal = 'equal'
}

export interface ISectionWidget {
   type: Widget.Section;
   divisions: ISectionDivision[]
}

export interface ISectionDivision {
   width: DivisionWidth;
   content: IWidget | null;
}

export interface ISectionWidgetInput {
   divisions: ISectionDivisionInput[]
}

export interface ISectionDivisionInput {
   width: DivisionWidth;
   contentSection: ISectionWidgetInput | null;
   contentButton: IButtonWidgetInput | null;
   contentTaskBoard: ITaskBoardWidgetInput | null;
}

//#endregion
