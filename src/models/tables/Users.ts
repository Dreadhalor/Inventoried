export module Users {
  const dbClient = require('../../db/db-client');

  const schema = {
    tableName: 'users',
    columns: [
      {name: 'id', dataType: 'string', primary: true},
      {name: 'assignmentIds', dataType: 'string[]'}
    ]
  }

  module.exports = dbClient.Table(schema);
}