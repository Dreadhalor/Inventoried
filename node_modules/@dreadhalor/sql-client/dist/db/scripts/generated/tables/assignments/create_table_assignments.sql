--======================================
--  Create Table Template
--  RUN-ORDER 0
--======================================
USE [Inventoried]

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'assignments')
BEGIN
  CREATE TABLE [assignments] (
    [id] varchar(max),
		[userId] varchar(max),
		[assetId] varchar(max),
		[checkoutDate] varchar(max),
		[dueDate] varchar(max)
  )
END