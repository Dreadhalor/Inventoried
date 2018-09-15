--======================================
--  Save Into Table Template
--  RUN-ORDER -1
--======================================
USE [Inventoried]

UPDATE [assignments]
SET
  [userId] = @userId,
	[assetId] = @assetId,
	[checkoutDate] = @checkoutDate,
	[dueDate] = @dueDate
WHERE [id] = @id;

IF @@ROWCOUNT=0
BEGIN
  INSERT INTO [assignments] (
    [id],
		[userId],
		[assetId],
		[checkoutDate],
		[dueDate]
  )
  VALUES (
    @id,
		@userId,
		@assetId,
		@checkoutDate,
		@dueDate
  )
END