export interface IDurable {
  id: string,
  serialNumber: string,
  categoryId: string,
  manufacturerId: string,
  notes: string,
  assignmentId: string,
  tagIds: string[],
  active: boolean
}