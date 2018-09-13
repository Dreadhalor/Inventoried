export module Manufacturers {
  const dbClient = require('../../db/db-client');

  const schema = {
    tableName: 'manufacturers',
    columns: [
      {name: 'id', dataType: 'string', primary: true},
      {name: 'value', dataType: 'string'}
    ]
  }

  module.exports = dbClient.Table(schema);
}