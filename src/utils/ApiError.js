// ApiError is a custom error class
// In JavaScript, you can create your own error types by extending the built-in Error class
class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = '') {
    // super(message) calls the parent Error class constructor
    // This sets the error message
    super(message);

    // statusCode is the HTTP status (400, 401, 404, 500, etc.)
    this.statusCode = statusCode;

    // success is always false for errors
    this.success = false;

    // errors is an optional array of detailed error messages (e.g., from Joi validation)
    this.errors = errors;

    // Stack trace helps you find where the error happened in your code
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;