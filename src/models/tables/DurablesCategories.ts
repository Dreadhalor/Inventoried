export module DurablesCategories {
  const dbClient = require('@dreadhalor/sql-client');

  const tableSchema = {
    name: 'durablesCategories',
    columns: [
      {name: 'id', dataType: 'string', primary: true},
      {name: 'value', dataType: 'string'}
    ]
  }

  module.exports = dbClient.Table(tableSchema);
}