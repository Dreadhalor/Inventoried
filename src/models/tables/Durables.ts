export module Durables {
  const dbClient = require('@dreadhalor/sql-client');

  const schema = {
    tableName: 'durables',
    columns: [
      {name: 'id', dataType: 'string', primary: true},
      {name: 'serialNumber', dataType: 'string'},
      {name: 'categoryId', dataType: 'string'},
      {name: 'manufacturerId', dataType: 'string'},
      {name: 'notes', dataType: 'string'},
      {name: 'assignmentId', dataType: 'string'},
      {name: 'tagIds', dataType: 'string[]'},
      {name: 'active', dataType: 'bit'}
    ]
  }

  module.exports = dbClient.Table(schema);
}