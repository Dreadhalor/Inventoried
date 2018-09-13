export module DurablesCategories {
  const dbClient = require('../../db/db-client');

  const schema = {
    tableName: 'durablesCategories',
    columns: [
      {name: 'id', dataType: 'string', primary: true},
      {name: 'value', dataType: 'string'}
    ]
  }

  module.exports = dbClient.Table(schema);
}