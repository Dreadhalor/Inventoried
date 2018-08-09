export interface IConsumable {
  id: string,
  label: string,
  quantity: number,
  categoryId: string,
  manufacturerId: string,
  notes: string,
  assignmentIds: string[],
  tagIds: string[]
}
