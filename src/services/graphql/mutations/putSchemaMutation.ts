import { gql } from '@apollo/client/core';
import { DocumentNode } from 'graphql';
import { schemaForBoardQuery, schemaQuery } from '..';
import { IInputBase, isBooleanInput, isChecklistInput, ISchema, ISchemaInput, isFileInput, isSelectInput, isTaskReferenceInput, isTextInput, schemaInputToSchema, UUID } from '../../../types';
import { EonixClient } from '../EonixClient';
import { schemaFragment } from '../fragments';

let mutation: DocumentNode | undefined;
export async function putSchemaMutation<SchemaAppData = any, InputAppData = null>(eonixClient: EonixClient, schemaInput: ISchemaInput<SchemaAppData>, inputs: IInputBase<InputAppData>[], boardId: UUID): Promise<void> {

   if (!mutation) {
      mutation = gql`
         mutation putSchema($schema: SchemaInput!, $inputsJson: String) { 
            putSchema(schema: $schema, inputsJson: $inputsJson) {
               ...SchemaFragment
            }
         }

         ${schemaFragment}
      `;
   }

   const variables = {
      schema: schemaInput,
      inputsJson: JSON.stringify(inputs)
   };

   /** Recursively add a __typename: string to all objects within */
   // Turning off for this line because when I switch to Record it doesn't work
   // eslint-disable-next-line @typescript-eslint/ban-types
   type AddTypeName<O> = O extends Array<infer U> ? AddTypeName<U>[] : O extends object ? { __typename: string } & { [K in keyof O]: AddTypeName<O[K]> } : O;

   const optimisticResponse = {
      __typename: 'Mutation',
      putSchema: {
         ...schemaInputToSchema(schemaInput, inputs, eonixClient.tokenUserId, Date.now()),
         __typename: 'Schema'
      } as AddTypeName<ISchema>
   };

   optimisticResponse.putSchema.inputs.forEach(input => {
      input.__typename = `${input.type[0].toUpperCase()}${input.type.substring(1)}Input`;

      if (isSelectInput(input)) {
         (input.options as any).__typename = 'TextValueOptions';
         (input.options as any).options = input.options.options?.map(o => ({ ...o, __typename: 'TextValueOption' })) || null;
      } else if (isTextInput(input)) {
         (input.options as any).__typename = 'TextOptions';
      } else if (isFileInput(input)) {
         (input.options as any).__typename = 'FileOptions';
      } else if (isChecklistInput(input)) {
         (input.options as any).__typename = 'TextValueOptions';
         (input.options as any).options = input.options.options?.map(o => ({ ...o, __typename: 'TextValueOption' })) || null;
      } else if (isTaskReferenceInput(input)) {
         //nothing to do with task references because there is no options object
      } else if (isBooleanInput(input)) {
         //Nothing to do with booleans because there are no options
      } else {
         console.error(`Unknown input type - ${input.type}`);
      }
   });

   await eonixClient.mutate({
      mutation,
      variables,
      optimisticResponse,
      update(store, fetchResult) {

         store.writeQuery({ ...schemaQuery(schemaInput.id), data: { schema: fetchResult.data!.putSchema } });

         store.writeQuery({ ...schemaForBoardQuery(boardId), data: { schemaForBoard: fetchResult.data!.putSchema } });
      }

   });

}