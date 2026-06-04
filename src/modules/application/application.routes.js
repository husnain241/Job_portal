const express = require('express');
const router = express.Router();
const applicationController = require('./application.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const upload = require('../../middlewares/upload.middleware');
const { applyJobSchema, updateStatusSchema } = require('./application.validation');

router.use(protect); // all application routes require login

// Candidate applies with resume upload
router.post(
  '/jobs/:jobId/apply',
  restrictTo('candidate'),
  upload.single('resume'), // 'resume' is the form field name
  validate(applyJobSchema),
  applicationController.applyForJob
);

router.get('/my', restrictTo('candidate'), applicationController.getMyApplications);
router.get('/jobs/:jobId', restrictTo('company', 'admin'), applicationController.getJobApplications);
router.patch('/:id/status', restrictTo('company', 'admin'), validate(updateStatusSchema), applicationController.updateApplicationStatus);

module.exports = router;