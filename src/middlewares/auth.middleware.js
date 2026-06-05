const jwt = require('jsonwebtoken');
const User = require('../modules/user/user.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { jwt: jwtConfig } = require('../config/env');

// protect middleware — checks if the user is logged in
// It reads the JWT access token from the Authorization header
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // JWT tokens are sent in the Authorization header like this:
  // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Split "Bearer <token>" and take the second part (the actual token)
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token found, user is not logged in
  if (!token) {
    return next(new ApiError(401, 'Not authorized. No token provided.'));
  }

  // jwt.verify() decodes and validates the token
  // If the token is expired or tampered, it throws an error
  // We wrap it in try/catch so we return a clean 401, not a 500
  let decoded;
  try {
    decoded = jwt.verify(token, jwtConfig.accessSecret);
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token. Please login again.'));
  }

  // Find the user in the database using the ID stored in the token
  // select('+refreshToken') includes the refreshToken field (normally hidden)
  const user = await User.findById(decoded.id);

  // If user no longer exists (was deleted), reject
  if (!user) {
    return next(new ApiError(401, 'User no longer exists.'));
  }

  // If account is deactivated
  if (!user.isActive) {
    return next(new ApiError(401, 'Your account has been deactivated.'));
  }

  // Attach the user to req so controllers can access it
  // e.g., req.user._id, req.user.role
  req.user = user;
  next();
});

// restrictTo middleware — checks if the user has the right role
// Usage: restrictTo('admin', 'company')
// It's a function that RETURNS a middleware (called a "higher-order function")
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user was set by the protect middleware above
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, 'You do not have permission to perform this action.')
      );
    }
    next();
  };
};

module.exports = { protect, restrictTo };