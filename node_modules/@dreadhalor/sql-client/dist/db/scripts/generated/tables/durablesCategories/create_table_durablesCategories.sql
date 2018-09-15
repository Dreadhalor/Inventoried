--======================================
--  Create Table Template
--  RUN-ORDER 0
--======================================
USE [Inventoried]

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'durablesCategories')
BEGIN
  CREATE TABLE [durablesCategories] (
    [id] varchar(max),
		[value] varchar(max)
  )
END