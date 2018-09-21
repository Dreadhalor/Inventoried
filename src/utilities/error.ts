export module Error {
  const formatError = exports.formatError = (error, title) => {
    if (typeof error != 'string') error = JSON.stringify(error);
    let result = {
      error: {
        title: title,
        message: error
      }
    };
    return result;
  }
}