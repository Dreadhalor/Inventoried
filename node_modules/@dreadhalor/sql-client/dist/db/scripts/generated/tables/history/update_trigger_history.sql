--======================================
--  Create T-SQL Trigger Template
--  RUN-ORDER 1
--======================================
USE [Inventoried]

IF OBJECT_ID ('[update_trigger_history]','TR') IS NOT NULL
  DROP TRIGGER [update_trigger_history]

EXEC('
  CREATE TRIGGER [update_trigger_history]
    ON "history"
    FOR UPDATE, INSERT, DELETE
  AS
    BEGIN
      IF EXISTS (SELECT * FROM DELETED UNION ALL SELECT * FROM INSERTED)
      SELECT * FROM DELETED UNION ALL SELECT * FROM INSERTED
    END
')