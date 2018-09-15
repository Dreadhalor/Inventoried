export module History {
  const dbClient = require('@dreadhalor/sql-client');

  const tableSchema = {
    name: 'history',
    columns: [
      {name: 'id', dataType: 'string', primary: true},
      {name: 'timestamp', dataType: 'string'},
      {name: 'agent', dataType: 'string'},
      {name: 'table', dataType: 'string'},
      {name: 'operation', dataType: 'string'},
      {name: 'info', dataType: 'object'}
    ]
  }

  module.exports = dbClient.Table(tableSchema);
}