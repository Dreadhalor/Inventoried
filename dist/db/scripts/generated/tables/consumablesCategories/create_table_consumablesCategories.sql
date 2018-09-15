--======================================
--  Create Table Template
--  RUN-ORDER 0
--======================================
USE [Inventoried]

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'consumablesCategories')
BEGIN
  CREATE TABLE [consumablesCategories] (
    [id] varchar(max),
		[value] varchar(max)
  )
END