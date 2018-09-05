--======================================
--  Create T-SQL Trigger Template
--======================================
USE [Inventoried]
GO

IF OBJECT_ID ('[update_trigger_consumables]','TR') IS NOT NULL
   DROP TRIGGER [update_trigger_consumables]
GO

CREATE TRIGGER [update_trigger_consumables]
   ON [consumables]
   FOR UPDATE, INSERT, DELETE
AS
  BEGIN
    if exists (select * from deleted union all select * from inserted)
    select * from deleted union all select * from inserted
  END
GO

