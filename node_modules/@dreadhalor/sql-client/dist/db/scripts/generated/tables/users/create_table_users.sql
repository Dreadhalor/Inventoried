--======================================
--  Create Table Template
--  RUN-ORDER 0
--======================================
USE [Inventoried]

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'users')
BEGIN
  CREATE TABLE [users] (
    [id] varchar(max),
		[assignmentIds] varchar(max)
  )
END