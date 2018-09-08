import { ITableSchema } from '../interfaces/ITableSchema';

const dbClient = require('../../db/db-client');

const schema: ITableSchema = {
  tableName: 'history',
  columns: [
    {name: 'id', dataType: 'varchar(max)', primary: true},
    {name: 'timestamp', dataType: 'varchar(max)'},
    {name: 'agent', dataType: 'varchar(max)'},
    {name: 'table', dataType: 'varchar(max)'},
    {name: 'operation', dataType: 'varchar(max)'},
    {name: 'info', dataType: 'object'}
  ]
}

module.exports = dbClient.Table(schema);