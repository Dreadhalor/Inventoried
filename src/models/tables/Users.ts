export module Users {
  const dbClient = require('../../db/db-client');

  const schema = {
    tableName: 'users',
    columns: [
      {name: 'id', dataType: 'varchar(max)', primary: true},
      {name: 'assignmentIds', dataType: 'varchar(max)[]'}
    ]
  }

  module.exports = dbClient.Table(schema);
}