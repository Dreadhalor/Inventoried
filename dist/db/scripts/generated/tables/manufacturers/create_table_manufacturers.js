-- ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ==
    --Create;
Table;
Template;
-- ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ==
    USE[Inventoried];
IF;
NOT;
EXISTS(SELECT * FROM, INFORMATION_SCHEMA.TABLES, where, TABLE_NAME = 'manufacturers');
BEGIN;
CREATE;
TABLE[manufacturers]([id], varchar(max), [value], varchar(max));
END;
//# sourceMappingURL=create_table_manufacturers.js.map