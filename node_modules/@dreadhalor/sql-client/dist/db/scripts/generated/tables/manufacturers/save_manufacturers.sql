--======================================
--  Save Into Table Template
--  RUN-ORDER -1
--======================================
USE [Inventoried]

UPDATE [manufacturers]
SET
  [value] = @value
WHERE [id] = @id;

IF @@ROWCOUNT=0
BEGIN
  INSERT INTO [manufacturers] (
    [id],
		[value]
  )
  VALUES (
    @id,
		@value
  )
END