import { ITableSchema } from '../interfaces/ITableSchema';

const dbClient = require('../../db/db-client');

const schema: ITableSchema = {
  tableName: 'users',
  columns: [
    {name: 'id', dataType: 'varchar(max)', primary: true},
    {name: 'assignmentIds', dataType: 'varchar(max)[]'}
  ]
}

module.exports = dbClient.Table(schema);