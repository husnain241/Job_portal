const User = require('./user.model');
const ApiError = require('../../utils/ApiError');

// getMe returns the currently logged-in user's profile
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

// updateMe lets a user update their own profile
const updateMe = async (userId, updateData) => {
  // Prevent users from changing their own role or password through this route
  const forbiddenFields = ['password', 'role', 'refreshToken'];
  forbiddenFields.forEach((field) => delete updateData[field]);

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,         // return the updated document
    runValidators: true, // run schema validations on update
  });

  return user;
};

// Admin: get all users
const getAllUsers = async (query) => {
  const { page = 1, limit = 10, role } = query;

  const filter = {};
  if (role) filter.role = role;

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};

// Admin: toggle user active status
const toggleUserStatus = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });

  return user;
};

// Admin: delete user
const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new ApiError(404, 'User not found');
};

module.exports = { getMe, updateMe, getAllUsers, toggleUserStatus, deleteUser };