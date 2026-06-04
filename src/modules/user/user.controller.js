const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const userService = require('./user.service');

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user._id);
  res.status(200).json(new ApiResponse(200, { user }, 'Profile fetched'));
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateMe(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, { user }, 'Profile updated'));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const result = await userService.getAllUsers(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Users fetched'));
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await userService.toggleUserStatus(req.params.id);
  res.status(200).json(new ApiResponse(200, { user }, 'User status updated'));
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'User deleted'));
});

module.exports = { getMe, updateMe, getAllUsers, toggleUserStatus, deleteUser };