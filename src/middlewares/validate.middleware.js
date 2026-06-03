const ApiError = require('../utils/ApiError');

// validate() returns a middleware function
// It takes a Joi schema and validates req.body against it
const validate = (schema) => (req, res, next) => {
  // schema.validate() checks the request body against the Joi rules
  // abortEarly: false means collect ALL errors, not just the first one
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    // error.details is an array of all validation errors
    // We map over it to extract just the human-readable messages
    const errorMessages = error.details.map((detail) => detail.message);

    // Throw a 400 Bad Request error with all validation messages
    return next(new ApiError(400, 'Validation Error', errorMessages));
  }

  // If validation passes, move to the next middleware or controller
  next();
};

module.exports = validate;