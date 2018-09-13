export module TableScriptGenerator {

  const templateStrings = {
    databaseName: /<database_name>/g,
    tableName: /<table_name>/g,
    tableInitFields: /<table_init_fields>/g,
    tableSetFields: /<table_set_fields>/g,
    tableInsertFields: /<table_insert_fields>/g,
    tableInsertValues: /<table_insert_values>/g,
    primaryKey: /<primary_key>/g,
    triggerName: /<trigger_name>/g
  }

  exports.generateScripts = (data) => {
    let templateValues = generateTemplateValues(data);
    let destDirectory = `${data.tablesDirectory}/${data.tableName}`;

    //construct table
    //construct trigger
    //create save query
  }

  const generateTemplateValues = (data) => {
    let templateValues: any = {
      databaseName: data.database.databaseName,
      tableName: data.tableName
    };

    let tableInitFields = '';
    data.columns.forEach((column, index) => {
      tableInitFields += `[${column.name}] ${data.database.parseDataType(column.dataType, true)}`
      if (index < data.columns.length - 1) tableInitFields += `,\n\t\t`;
    });
    templateValues.tableInitFields = tableInitFields;

    let tableSetFields = '', tableInsertFields = '', tableInsertValues = '';
    data.columns.forEach((column, index) => {
      let primary = data.columns[index].primary;
      if (!primary) tableSetFields += `[${column.name}] = @${column.name}`;
      tableInsertFields += `[${column.name}]`;
      tableInsertValues += `@${column.name}`;
      if (index < data.columns.length - 1){
        if (!primary) tableSetFields += `,\n\t`;
        tableInsertFields += `,\n\t\t`;
        tableInsertValues += `,\n\t\t`;
      }
    })
    templateValues.tableSetFields = tableSetFields;
    templateValues.tableInsertFields = tableInsertFields;
    templateValues.tableInsertValues = tableInsertValues;
    templateValues.primaryKey = data.columns.find(match => match.primary).name;

    templateValues.triggerName = `update_trigger_${data.tableName}`;

    return templateValues;
  }

}