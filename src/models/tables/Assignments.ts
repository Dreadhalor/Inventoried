export module Assignments {
  const dbClient = require('@dreadhalor/sql-client');

  const tableSchema = {
    name: 'assignments',
    columns: [
      {name: 'id', dataType: 'string', primary: true},
      {name: 'userId', dataType: 'string'},
      {name: 'assetId', dataType: 'string'},
      {name: 'checkoutDate', dataType: 'string'},
      {name: 'dueDate', dataType: 'string'}
    ]
  }

  module.exports = dbClient.Table(tableSchema);
}