const express = require('express');
const router = express.Router();
const SavedJobController = require('./savedJob.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');
// ✅ Routes for saved jobs
router.post('/:jobId', protect, restrictTo('candidate'), SavedJobController.saveJob);
router.delete('/:jobId', protect, restrictTo('candidate'), SavedJobController.unsaveJob);
router.get('/', protect, restrictTo('candidate'), SavedJobController.getSavedJobs);
router.get('/:jobId/status', protect, restrictTo('candidate'), SavedJobController.isJobSaved);

module.exports = router;

