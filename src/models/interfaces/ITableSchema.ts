export interface ITableSchema {
  tableName: string,
  columns: {
    name: string,
    dataType: string,
    array?: boolean,
    primary?: boolean
  }[]
}