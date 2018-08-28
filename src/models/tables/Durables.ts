import { ITableSchema } from '../interfaces/ITableSchema';

const dbClient = require('../../db/db-client');

const schema: ITableSchema = {
  tableName: 'durables',
  columns: [
    {name: 'id', dataType: 'varchar(max)', primary: true},
    {name: 'serialNumber', dataType: 'varchar(max)'},
    {name: 'categoryId', dataType: 'varchar(max)'},
    {name: 'manufacturerId', dataType: 'varchar(max)'},
    {name: 'notes', dataType: 'varchar(max)'},
    {name: 'assignmentId', dataType: 'varchar(max)'},
    {name: 'tagIds', dataType: 'varchar(max)'},
    {name: 'active', dataType: 'bit'}
  ]
}

module.exports = dbClient.Table(schema);