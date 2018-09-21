export module Error {
  const formatError = exports.formatError = (error, title) => {
    if (typeof error != 'string') error = error.toString();
    let result = {
      error: {
        title: title,
        message: error
      }
    };
    return result;
  }
}