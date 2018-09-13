-- ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ==
    --Create;
Table;
Template;
-- ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ==
    USE[Inventoried];
IF;
NOT;
EXISTS(SELECT * FROM, INFORMATION_SCHEMA.TABLES, where, TABLE_NAME = 'tags');
BEGIN;
CREATE;
TABLE[tags]([id], varchar(max), [value], varchar(max));
END;
//# sourceMappingURL=create_table_tags.js.map