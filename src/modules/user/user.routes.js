const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');

// All routes below require login
router.use(protect);

router.get('/me', userController.getMe);
router.patch('/me', userController.updateMe);

// Admin only routes
router.get('/', restrictTo('admin'), userController.getAllUsers);
router.patch('/:id/toggle-status', restrictTo('admin'), userController.toggleUserStatus);
router.delete('/:id', restrictTo('admin'), userController.deleteUser);

module.exports = router;