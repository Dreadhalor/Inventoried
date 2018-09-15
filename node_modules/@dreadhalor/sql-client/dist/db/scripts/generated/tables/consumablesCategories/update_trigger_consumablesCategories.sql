--======================================
--  Create T-SQL Trigger Template
--  RUN-ORDER 1
--======================================
USE [Inventoried]

IF OBJECT_ID ('[update_trigger_consumablesCategories]','TR') IS NOT NULL
  DROP TRIGGER [update_trigger_consumablesCategories]

EXEC('
  CREATE TRIGGER [update_trigger_consumablesCategories]
    ON "consumablesCategories"
    FOR UPDATE, INSERT, DELETE
  AS
    BEGIN
      IF EXISTS (SELECT * FROM DELETED UNION ALL SELECT * FROM INSERTED)
      SELECT * FROM DELETED UNION ALL SELECT * FROM INSERTED
    END
')