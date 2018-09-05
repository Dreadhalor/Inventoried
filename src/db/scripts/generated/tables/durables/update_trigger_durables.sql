--======================================
--  Create T-SQL Trigger Template
--======================================
USE [Inventoried]
GO

IF OBJECT_ID ('[update_trigger_durables]','TR') IS NOT NULL
   DROP TRIGGER [update_trigger_durables]
GO

CREATE TRIGGER [update_trigger_durables]
   ON [durables]
   FOR UPDATE, INSERT, DELETE
AS
  BEGIN
    if exists (select * from deleted union all select * from inserted)
    select * from deleted union all select * from inserted
  END
GO

