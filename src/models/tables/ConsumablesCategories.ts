import { ITableSchema } from '../interfaces/ITableSchema';

const dbClient = require('../../db/db-client');

const schema: ITableSchema = {
  tableName: 'consumablesCategories',
  columns: [
    {name: 'id', dataType: 'varchar(max)', primary: true},
    {name: 'value', dataType: 'varchar(max)'}
  ]
}

module.exports = dbClient.Table(schema);