--======================================
--  Create T-SQL Trigger Template
--  RUN-ORDER 1
--======================================
USE [Inventoried]

IF OBJECT_ID ('[update_trigger_manufacturers]','TR') IS NOT NULL
  DROP TRIGGER [update_trigger_manufacturers]

EXEC('
  CREATE TRIGGER [update_trigger_manufacturers]
    ON "manufacturers"
    FOR UPDATE, INSERT, DELETE
  AS
    BEGIN
      IF EXISTS (SELECT * FROM DELETED UNION ALL SELECT * FROM INSERTED)
      SELECT * FROM DELETED UNION ALL SELECT * FROM INSERTED
    END
')