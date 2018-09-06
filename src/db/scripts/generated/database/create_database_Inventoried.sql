--======================================
--  Create Database Template
--======================================
USE [master]

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name LIKE 'Inventoried')
BEGIN
  CREATE DATABASE [Inventoried]
END