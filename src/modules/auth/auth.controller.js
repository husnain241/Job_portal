const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const authService = require('./auth.service');

// Helper: sets the refresh token as an HTTP-only cookie
// HTTP-only cookies cannot be accessed by JavaScript — safer than localStorage
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,   // JS cannot read this cookie
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // prevents cross-site request forgery
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body);

  setRefreshTokenCookie(res, refreshToken);

  // Remove sensitive fields before sending response
  user.password = undefined;
  user.refreshToken = undefined;

  res.status(201).json(
    new ApiResponse(201, { user, accessToken }, 'Registration successful')
  );
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

  setRefreshTokenCookie(res, refreshToken);

  user.password = undefined;
  user.refreshToken = undefined;

  res.status(200).json(
    new ApiResponse(200, { user, accessToken }, 'Login successful')
  );
});

// POST /api/auth/refresh-token
const refreshToken = asyncHandler(async (req, res) => {
  // Read refresh token from cookie OR from request body
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refreshAccessToken(token);

  setRefreshTokenCookie(res, newRefreshToken);

  res.status(200).json(
    new ApiResponse(200, { accessToken }, 'Token refreshed successfully')
  );
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user._id);

  // Clear the cookie
  res.clearCookie('refreshToken');

  res.status(200).json(
    new ApiResponse(200, null, 'Logged out successfully')
  );
});

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);

  // Always respond with success to prevent email enumeration attacks
  res.status(200).json(
    new ApiResponse(200, null, 'If that email exists, an OTP has been sent')
  );
});

// POST /api/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);

  res.status(200).json(
    new ApiResponse(200, null, 'Password reset successful')
  );
});

module.exports = { register, login, refreshToken, logout, forgotPassword, resetPassword };