--======================================
--  Create Table Template
--  RUN-ORDER 0
--======================================
USE [Inventoried]

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'tags')
BEGIN
  CREATE TABLE [tags] (
    [id] varchar(max),
		[value] varchar(max)
  )
END