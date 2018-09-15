--======================================
--  Save Into Table Template
--  RUN-ORDER -1
--======================================
USE [Inventoried]

UPDATE [durables]
SET
  [serialNumber] = @serialNumber,
	[categoryId] = @categoryId,
	[manufacturerId] = @manufacturerId,
	[notes] = @notes,
	[assignmentId] = @assignmentId,
	[tagIds] = @tagIds,
	[active] = @active
WHERE [id] = @id;

IF @@ROWCOUNT=0
BEGIN
  INSERT INTO [durables] (
    [id],
		[serialNumber],
		[categoryId],
		[manufacturerId],
		[notes],
		[assignmentId],
		[tagIds],
		[active]
  )
  VALUES (
    @id,
		@serialNumber,
		@categoryId,
		@manufacturerId,
		@notes,
		@assignmentId,
		@tagIds,
		@active
  )
END