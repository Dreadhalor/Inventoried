--======================================
--  Save Into Table Template
--  RUN-ORDER -1
--======================================
USE [Inventoried]

UPDATE [users]
SET
  [assignmentIds] = @assignmentIds
WHERE [id] = @id;

IF @@ROWCOUNT=0
BEGIN
  INSERT INTO [users] (
    [id],
		[assignmentIds]
  )
  VALUES (
    @id,
		@assignmentIds
  )
END