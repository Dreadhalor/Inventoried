--======================================
--  Save Into Table Template
--  RUN-ORDER -1
--======================================
USE [Inventoried]

UPDATE [consumablesCategories]
SET
  [value] = @value
WHERE [id] = @id;

IF @@ROWCOUNT=0
BEGIN
  INSERT INTO [consumablesCategories] (
    [id],
		[value]
  )
  VALUES (
    @id,
		@value
  )
END