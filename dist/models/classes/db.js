const sql = require('mssql/msnodesqlv8');
let pool = null;
exports.connect = (config) => pool = new sql.ConnectionPool(config, (err) => {
    //Error handling goes here
    if (err)
        return err;
    return true;
});
exports.Schema = (fields) => {
    let columns = Object.keys(fields);
    //console.log(columns);
    let fieldFormats = columns.map(key => [key, fields[key].toString()]);
    //console.log(fieldFormats);
    return fieldFormats;
};
exports.model = (tableName, fields) => {
    return createTable(tableName, fields);
};
function createTable(tableName, fields) {
    return new Promise((resolve, reject) => {
        let fieldsString = '';
        fields.forEach((pair, index) => {
            fieldsString += `${pair[0]} ${pair[1]}`;
            if (index < fields.length - 1)
                fieldsString += ', ';
        });
        try {
            const transaction = new sql.Transaction(pool);
            transaction.begin(err1 => {
                if (err1)
                    reject(err1);
                let request = new sql.Request(transaction);
                let query = `create table "${tableName}" (${fieldsString});`;
                request.query(query, (err2, result) => {
                    if (err2)
                        reject(err2);
                    transaction.commit(err3 => {
                        if (err3)
                            reject(err3);
                        resolve(result);
                    });
                });
            });
        }
        catch (err4) {
            reject(err4);
        }
    });
}
let transaction = (tableName, fields) => {
    let value = '3';
    let fieldsString = '';
    fields.forEach((pair, index) => {
        fieldsString += `${pair[0]} ${pair[1]}`;
        if (index < fields.length - 1)
            fieldsString += ', ';
    });
    try {
        const transaction = new sql.Transaction(pool);
        transaction.begin(err => {
            // ... error checks
            console.log('begin err:');
            console.log(err);
            const request = new sql.Request(transaction);
            let query = `create table ${tableName} (${fieldsString});`;
            console.log(query);
            request.query(query, (err, result) => {
                if (err) {
                    console.log('insert error');
                    console.log(err);
                    return err;
                }
                else {
                    console.log('result:');
                    console.log(result);
                    transaction.commit(err => {
                        if (err) {
                            console.log('commit error');
                            return err;
                        }
                        else
                            return 'success!';
                    });
                }
            });
        });
    }
    catch (err) {
        console.log('catch error');
        console.log(err);
        return err;
        // ... error checks
    }
};
//# sourceMappingURL=db.js.map