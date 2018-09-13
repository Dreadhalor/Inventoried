-- ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ==
    --Save;
Into;
Table;
Template;
-- ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ==
    USE[Inventoried];
UPDATE[durables];
SET[serialNumber] = ;
categoryId = [0];
manufacturerId = [0];
notes = [0];
assignmentId = [0];
tagIds = [0];
active = [0];
WHERE[id] = ;
;
IF;
0;
BEGIN;
INSERT;
INTO[durables]([id], [serialNumber], [categoryId], [manufacturerId], [notes], [assignmentId], [tagIds], [active]);
VALUES();
END;
//# sourceMappingURL=save_durables.js.map