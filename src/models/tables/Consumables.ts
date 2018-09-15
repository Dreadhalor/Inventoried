export module Consumables {
  const dbClient = require('@dreadhalor/sql-client');

  const schema = {
    tableName: 'consumables',
    columns: [
      {name: 'id', dataType: 'string', primary: true},
      {name: 'label', dataType: 'string'},
      {name: 'quantity', dataType: 'int'},
      {name: 'categoryId', dataType: 'string'},
      {name: 'manufacturerId', dataType: 'string'},
      {name: 'notes', dataType: 'string'},
      {name: 'assignmentIds', dataType: 'string[]'},
      {name: 'tagIds', dataType: 'string[]'}
    ]
  }

  module.exports = dbClient.Table(schema);
}