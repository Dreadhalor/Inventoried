export module Tags {
  const dbClient = require('../../db/db-client');

  const schema = {
    tableName: 'tags',
    columns: [
      {name: 'id', dataType: 'varchar(max)', primary: true},
      {name: 'value', dataType: 'varchar(max)'}
    ]
  }

  module.exports = dbClient.Table(schema);
}