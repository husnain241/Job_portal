const express = require('express');
const router = express.Router();
const jobController = require('./job.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { createJobSchema, updateJobSchema } = require('./job.validation');

// Public routes
router.get('/', jobController.getAllJobs);
router.get('/stats', protect, restrictTo('admin'), jobController.getJobStats);
router.get('/:id', jobController.getJobById);

// Protected routes
router.post('/', protect, restrictTo('company'), validate(createJobSchema), jobController.createJob);
router.patch('/:id', protect, restrictTo('company', 'admin'), validate(updateJobSchema), jobController.updateJob);
router.delete('/:id', protect, restrictTo('company', 'admin'), jobController.deleteJob);

module.exports = router;