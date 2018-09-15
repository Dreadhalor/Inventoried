export module Manufacturers {
  const dbClient = require('@dreadhalor/sql-client');

  const tableSchema = {
    name: 'manufacturers',
    columns: [
      {name: 'id', dataType: 'string', primary: true},
      {name: 'value', dataType: 'string'}
    ]
  }

  module.exports = dbClient.Table(tableSchema);
}