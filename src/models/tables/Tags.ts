export module Tags {
  const dbClient = require('@dreadhalor/sql-client');

  const schema = {
    tableName: 'tags',
    columns: [
      {name: 'id', dataType: 'string', primary: true},
      {name: 'value', dataType: 'string'}
    ]
  }

  module.exports = dbClient.Table(schema);
}