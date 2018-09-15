--======================================
--  Save Into Table Template
--  RUN-ORDER -1
--======================================
USE [Inventoried]

UPDATE [durablesCategories]
SET
  [value] = @value
WHERE [id] = @id;

IF @@ROWCOUNT=0
BEGIN
  INSERT INTO [durablesCategories] (
    [id],
		[value]
  )
  VALUES (
    @id,
		@value
  )
END