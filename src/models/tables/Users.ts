export module Users {
  const dbClient = require('@dreadhalor/sql-client');

  const schema = {
    tableName: 'users',
    columns: [
      {name: 'id', dataType: 'string', primary: true},
      {name: 'assignmentIds', dataType: 'string[]'}
    ]
  }

  module.exports = dbClient.Table(schema);
}