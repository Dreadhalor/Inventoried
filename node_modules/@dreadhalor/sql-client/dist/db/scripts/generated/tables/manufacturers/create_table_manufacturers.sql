--======================================
--  Create Table Template
--  RUN-ORDER 0
--======================================
USE [Inventoried]

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'manufacturers')
BEGIN
  CREATE TABLE [manufacturers] (
    [id] varchar(max),
		[value] varchar(max)
  )
END