--======================================
--  Create Table Template
--  RUN-ORDER 0
--======================================
USE [Inventoried]

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'durables')
BEGIN
  CREATE TABLE [durables] (
    [id] varchar(max),
		[serialNumber] varchar(max),
		[categoryId] varchar(max),
		[manufacturerId] varchar(max),
		[notes] varchar(max),
		[assignmentId] varchar(max),
		[tagIds] varchar(max),
		[active] bit
  )
END