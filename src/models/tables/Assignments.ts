import { ITableSchema } from '../interfaces/ITableSchema';

const dbClient = require('../../db/db-client');

const schema: ITableSchema = {
  tableName: 'assignments',
  columns: [
    {name: 'id', dataType: 'varchar(max)', primary: true},
    {name: 'userId', dataType: 'varchar(max)'},
    {name: 'assetId', dataType: 'varchar(max)'},
    {name: 'checkoutDate', dataType: 'varchar(max)'},
    {name: 'dueDate', dataType: 'varchar(max)'}
  ]
}

module.exports = dbClient.Table(schema);