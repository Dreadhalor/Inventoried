--======================================
--  Save Into Table Template
--======================================
USE [<database_name>]

UPDATE [<table_name>]
SET
  <args>
WHERE [<primary>] = @<primary>;

IF @@ROWCOUNT=0
BEGIN
  INSERT INTO [<table_name>] (
    <fields>
  )
  VALUES (
    <values>
  )
END