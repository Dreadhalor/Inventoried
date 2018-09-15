--======================================
--  Save Into Table Template
--  RUN-ORDER -1
--======================================
USE [Inventoried]

UPDATE [history]
SET
  [timestamp] = @timestamp,
	[agent] = @agent,
	[table] = @table,
	[operation] = @operation,
	[info] = @info
WHERE [id] = @id;

IF @@ROWCOUNT=0
BEGIN
  INSERT INTO [history] (
    [id],
		[timestamp],
		[agent],
		[table],
		[operation],
		[info]
  )
  VALUES (
    @id,
		@timestamp,
		@agent,
		@table,
		@operation,
		@info
  )
END