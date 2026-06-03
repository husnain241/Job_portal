const ApiError = require('../utils/ApiError');
const { nodeEnv } = require('../config/env');

// Express knows this is an error handler because it has 4 parameters
// (err, req, res, next) — the "err" as first param is the key
const errorMiddleware = (err, req, res, next) => {
  // If the error is already our custom ApiError, use it directly
  // Otherwise, create a generic 500 (Internal Server Error)
  let error = err;

  if (!(error instanceof ApiError)) {
    // Check for MongoDB duplicate key error (e.g., email already exists)
    // MongoDB error code 11000 means duplicate key
    const statusCode = error.code === 11000 ? 409 : 500;

    // Build a readable message from the duplicate key error
    const message =
      error.code === 11000
        ? `Duplicate value: ${Object.keys(error.keyValue).join(', ')} already exists`
        : error.message || 'Internal Server Error';

    error = new ApiError(statusCode, message);
  }

  // Build the response object
  const response = {
    success: false,
    message: error.message,
    errors: error.errors || [],
    // Only show the stack trace in development mode
    // Never expose stack traces in production (security risk)
    ...(nodeEnv === 'development' && { stack: error.stack }),
  };

  // Send the error response with the correct HTTP status code
  return res.status(error.statusCode).json(response);
};

module.exports = errorMiddleware;