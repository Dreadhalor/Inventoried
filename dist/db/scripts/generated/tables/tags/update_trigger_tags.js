-- ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ==
    --Create;
T - SQL;
Trigger;
Template;
-- ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ==
    USE[Inventoried];
IF;
OBJECT_ID('[update_trigger_tags]', 'TR');
IS;
NOT;
NULL;
DROP;
TRIGGER[update_trigger_tags];
EXEC(', CREATE, TRIGGER[update_trigger_tags], ON, "tags", FOR, UPDATE, INSERT, DELETE, AS, BEGIN, IF, EXISTS(SELECT * FROM, DELETED, UNION, ALL, SELECT * FROM, INSERTED), SELECT * FROM, DELETED, UNION, ALL, SELECT * FROM, INSERTED, END, '));
//# sourceMappingURL=update_trigger_tags.js.map