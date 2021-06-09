
export interface IGraphResponse<TQuery> {
   errors?: { message: string }[] | null
   data: TQuery
}