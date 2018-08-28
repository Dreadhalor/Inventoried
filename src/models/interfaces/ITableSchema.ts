export interface ITableSchema {
  tableName: string,
  columns: {
    name: string,
    dataType: string,
    primary?: boolean
  }[]
}