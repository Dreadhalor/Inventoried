--======================================
--  Create T-SQL Trigger Template
--======================================
USE [<database_name>]

IF OBJECT_ID ('[<trigger_name>]','TR') IS NOT NULL
  DROP TRIGGER [<trigger_name>]

EXEC('
  CREATE TRIGGER [<trigger_name>]
    ON "<table_name>"
    FOR UPDATE, INSERT, DELETE
  AS
    BEGIN
      if exists (select * from deleted union all select * from inserted)
      select * from deleted union all select * from inserted
    END
')