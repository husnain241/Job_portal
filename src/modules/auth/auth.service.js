const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // built-in Node.js module for generating random values
const User = require('../user/user.model');
const ApiError = require('../../utils/ApiError');
const sendEmail = require('../../utils/sendEmail');
const { jwt: jwtConfig } = require('../../config/env');

// ─── TOKEN GENERATORS ─────────────────────────────────────────────

// generateAccessToken creates a short-lived token (15 minutes)
// It embeds the user's id and role inside the token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // payload (data inside the token)
    jwtConfig.accessSecret,            // secret key to sign the token
    { expiresIn: jwtConfig.accessExpiresIn } // token expires in 15m
  );
};

// generateRefreshToken creates a long-lived token (7 days)
// Used to get a new access token without logging in again
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    jwtConfig.refreshSecret,
    { expiresIn: jwtConfig.refreshExpiresIn }
  );
};

// ─── AUTH SERVICES ────────────────────────────────────────────────

// registerUser handles creating a new user account
const registerUser = async (body) => {
  const { name, email, password, role, companyName, companyWebsite } = body;

  // Check if a user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  // Create the user — password will be auto-hashed by the pre-save hook
  const user = await User.create({
    name,
    email,
    password,
    role,
    companyName,
    companyWebsite,
  });

  // Generate tokens for the new user
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token to database so we can validate it later
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

// loginUser handles logging in
const loginUser = async ({ email, password }) => {
  // Find user by email
  // We use .select('+password') because password has select:false in the model
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    // Use generic message — don't reveal whether email exists or not (security)
    throw new ApiError(401, 'Invalid email or password');
  }

  // Compare the plain text password with the hashed one
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(401, 'Your account has been deactivated');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Update refresh token in database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

// refreshAccessToken uses a refresh token to issue a new access token
const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Refresh token not provided');
  }

  // Verify the refresh token is valid and not expired
  const decoded = jwt.verify(incomingRefreshToken, jwtConfig.refreshSecret);

  // Find the user and check if their stored refresh token matches
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  // Issue a new access token
  const accessToken = generateAccessToken(user);

  // Also rotate the refresh token (good security practice)
  const newRefreshToken = generateRefreshToken(user);
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken: newRefreshToken };
};

// logoutUser clears the refresh token from the database
const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

// forgotPassword generates a 6-digit OTP and emails it to the user
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  // Important: Even if user doesn't exist, we send a generic success message
  // This prevents attackers from knowing which emails are registered
  if (!user) return;

  // crypto.randomInt generates a random number between 100000 and 999999
  const otp = crypto.randomInt(100000, 999999).toString();

  // Hash the OTP before saving (same reason we hash passwords)
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  // OTP expires in 10 minutes
  user.resetPasswordOTP = hashedOtp;
  user.resetPasswordOTPExpiry = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  // Send the plain OTP (not hashed) to the user's email
  await sendEmail({
    to: user.email,
    subject: 'Your Password Reset OTP',
    html: `
      <h2>Password Reset Request</h2>
      <p>Your OTP is: <strong style="font-size: 24px">${otp}</strong></p>
      <p>This OTP expires in 10 minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });
};

// resetPassword verifies the OTP and sets a new password
const resetPassword = async ({ email, otp, newPassword }) => {
  // Hash the incoming OTP to compare with stored hash
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  // Find user where:
  // 1. Email matches
  // 2. OTP matches the hashed version
  // 3. OTP hasn't expired yet
  const user = await User.findOne({
    email,
    resetPasswordOTP: hashedOtp,
    resetPasswordOTPExpiry: { $gt: Date.now() }, // $gt means "greater than"
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  // Set new password — the pre-save hook will hash it automatically
  user.password = newPassword;

  // Clear the OTP fields so it can't be reused
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpiry = undefined;

  await user.save();
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
};