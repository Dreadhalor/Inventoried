-- ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ==
    --Save;
Into;
Table;
Template;
-- ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ==
    USE[Inventoried];
UPDATE[history];
SET[timestamp] = ;
agent = [0];
table = [0];
operation = [0];
info = [0];
WHERE[id] = ;
;
IF;
0;
BEGIN;
INSERT;
INTO[history]([id], [timestamp], [agent], [table], [operation], [info]);
VALUES();
END;
//# sourceMappingURL=save_history.js.map