-- ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ==
    --Create;
T - SQL;
Trigger;
Template;
-- ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ==
    USE[Inventoried];
IF;
OBJECT_ID('[update_trigger_durables]', 'TR');
IS;
NOT;
NULL;
DROP;
TRIGGER[update_trigger_durables];
EXEC(', CREATE, TRIGGER[update_trigger_durables], ON, "durables", FOR, UPDATE, INSERT, DELETE, AS, BEGIN, IF, EXISTS(SELECT * FROM, DELETED, UNION, ALL, SELECT * FROM, INSERTED), SELECT * FROM, DELETED, UNION, ALL, SELECT * FROM, INSERTED, END, '));
//# sourceMappingURL=update_trigger_durables.js.map