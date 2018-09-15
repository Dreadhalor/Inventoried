--======================================
--  Create Table Template
--  RUN-ORDER 0
--======================================
USE [Inventoried]

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'consumables')
BEGIN
  CREATE TABLE [consumables] (
    [id] varchar(max),
		[label] varchar(max),
		[quantity] int,
		[categoryId] varchar(max),
		[manufacturerId] varchar(max),
		[notes] varchar(max),
		[assignmentIds] varchar(max),
		[tagIds] varchar(max)
  )
END