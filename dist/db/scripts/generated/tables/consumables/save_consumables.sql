--======================================
--  Save Into Table Template
--  RUN-ORDER -1
--======================================
USE [Inventoried]

UPDATE [consumables]
SET
  [label] = @label,
	[quantity] = @quantity,
	[categoryId] = @categoryId,
	[manufacturerId] = @manufacturerId,
	[notes] = @notes,
	[assignmentIds] = @assignmentIds,
	[tagIds] = @tagIds
WHERE [id] = @id;

IF @@ROWCOUNT=0
BEGIN
  INSERT INTO [consumables] (
    [id],
		[label],
		[quantity],
		[categoryId],
		[manufacturerId],
		[notes],
		[assignmentIds],
		[tagIds]
  )
  VALUES (
    @id,
		@label,
		@quantity,
		@categoryId,
		@manufacturerId,
		@notes,
		@assignmentIds,
		@tagIds
  )
END