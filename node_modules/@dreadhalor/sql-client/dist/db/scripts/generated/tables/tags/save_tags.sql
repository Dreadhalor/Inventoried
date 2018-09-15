--======================================
--  Save Into Table Template
--  RUN-ORDER -1
--======================================
USE [Inventoried]

UPDATE [tags]
SET
  [value] = @value
WHERE [id] = @id;

IF @@ROWCOUNT=0
BEGIN
  INSERT INTO [tags] (
    [id],
		[value]
  )
  VALUES (
    @id,
		@value
  )
END