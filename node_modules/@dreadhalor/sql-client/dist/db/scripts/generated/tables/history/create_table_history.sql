--======================================
--  Create Table Template
--  RUN-ORDER 0
--======================================
USE [Inventoried]

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'history')
BEGIN
  CREATE TABLE [history] (
    [id] varchar(max),
		[timestamp] varchar(max),
		[agent] varchar(max),
		[table] varchar(max),
		[operation] varchar(max),
		[info] varchar(max)
  )
END