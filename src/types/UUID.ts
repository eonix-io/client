
//This is causing a stackoverflow when compiling. Looks like it's a recent bug that's been fixed. Waiting for update.
// https://github.com/microsoft/TypeScript/issues/41651
export type UUID = `${string}-${string}-${string}-${string}-${string}`;
//export type UUID = string;