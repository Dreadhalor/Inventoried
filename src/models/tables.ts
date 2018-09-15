export module Tables {

  const dbClient = require('@dreadhalor/sql-client');

  const tables = {
    Users: {
      name: 'users',
      columns: [
        'id',
        'assignmentIds'
      ],
      primary: 'id'
    },

    Durables: {
      name: 'durables',
      columns: [
        'id',
        'serialNumber',
        'categoryId',
        'manufacturerId',
        'notes',
        'assignmentId',
        'tagIds',
        'active'
      ],
      primary: 'id'
    },

    Consumables: {
      name: 'consumables',
      columns: [
        'id',
        'label',
        'quantity',
        'categoryId',
        'manufacturerId',
        'notes',
        'assignmentIds',
        'tagIds'
      ],
      primary: 'id'
    },

    Assignments: {
      name: 'assignments',
      columns: [
        'id',
        'userId',
        'assetId',
        'checkoutDate',
        'dueDate'
      ],
      primary: 'id'
    },

    DurablesCategories: {
      name: 'durablesCategories',
      columns: [
        'id',
        'value'
      ],
      primary: 'id'
    },

    ConsumablesCategories: {
      name: 'consumablesCategories',
      columns: [
        'id',
        'value'
      ],
      primary: 'id'
    },

    Manufacturers: {
      name: 'manufacturers',
      columns: [
        'id',
        'value'
      ],
      primary: 'id'
    },

    Tags: {
      name: 'tags',
      columns: [
        'id',
        'value'
      ],
      primary: 'id'
    },

    History: {
      name: 'history',
      columns: [
        'id',
        'timestamp',
        'agent',
        'table',
        'operation',
        'info'
      ],
      primary: 'id'
    }
  }

  module.exports = dbClient.Tables(tables);
}