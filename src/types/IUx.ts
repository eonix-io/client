
import { UUID, ISectionWidget, ISectionWidgetInput, ISectionDivisionInput, Widget, ISectionDivision, IWidget, IButtonWidgetInput, ITaskBoardWidgetInput } from '.';

export interface IUx {
   id: UUID;
   boardId: UUID;
   name: string;
   description: string | null;
   sections: ISectionWidget[];
   openAccess: boolean;
   createdBy: UUID;
   createdDate: number;
}

export interface IUxInput {
   id: UUID;
   boardId: UUID;
   name: string;
   openAccess: boolean;
   description: string | null;
   sections: ISectionWidgetInput[];
}

//#region UxInputToUx

export function uxInputToUx(input: IUxInput, createdBy: UUID, createdDate: number): IUx {
   const ux: IUx = {
      id: input.id,
      boardId: input.boardId,
      description: input.description,
      name: input.name,
      createdBy,
      createdDate,
      sections: input.sections.map(sectionInputToSection),
      openAccess: input.openAccess
   };
   return ux;
}

function sectionInputToSection(input: ISectionWidgetInput): ISectionWidget {
   const section: ISectionWidget = {
      type: Widget.Section,
      divisions: input.divisions.map(dInput => {
         const d: ISectionDivision = {
            width: dInput.width,
            content: contentInputToContent(dInput)
         };
         return d;
      })
   };
   return section;
}

function contentInputToContent(divisionInput: ISectionDivisionInput): IWidget | null {
   if (divisionInput.contentButton) { return { ...divisionInput.contentButton, type: Widget.Button }; }
   if (divisionInput.contentTaskBoard) { return { ...divisionInput.contentTaskBoard, type: Widget.TaskBoard }; }
   if (divisionInput.contentSection) { return sectionInputToSection(divisionInput.contentSection); }
   return null;
}

//#endregion

//#region UxToUxInput

export function uxToUxInput(ux: IUx): IUxInput {

   const uxInput: IUxInput = {
      id: ux.id,
      boardId: ux.boardId,
      name: ux.name,
      description: ux.description,
      sections: ux.sections.map(uxSectionToInput),
      openAccess: ux.openAccess
   };

   return uxInput;

}

function uxSectionToInput(section: ISectionWidget): ISectionWidgetInput {
   const sectionInput: ISectionWidgetInput = {
      divisions: section.divisions.map(d => {
         if (!d.content) {
            return { width: d.width, contentButton: null, contentSection: null, contentTaskBoard: null } as ISectionDivisionInput;
         }

         const { type, ...contentWithoutType } = d.content;
         const input: ISectionDivisionInput = {
            width: d.width,
            contentButton: (type === Widget.Button ? contentWithoutType : null) as IButtonWidgetInput,
            contentTaskBoard: (type === Widget.TaskBoard ? contentWithoutType : null) as ITaskBoardWidgetInput,
            contentSection: (type === Widget.Section ? uxSectionToInput(d.content as ISectionWidget) : null)
         };
         return input;
      })
   };

   return sectionInput;
}

//endregion