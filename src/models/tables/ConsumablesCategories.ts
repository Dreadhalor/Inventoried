export module ConsumablesCategories {
  const dbClient = require('@dreadhalor/sql-client');

  const schema = {
    tableName: 'consumablesCategories',
    columns: [
      {name: 'id', dataType: 'string', primary: true},
      {name: 'value', dataType: 'string'}
    ]
  }

  module.exports = dbClient.Table(schema);
}