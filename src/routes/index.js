const express = require('express');
const router = express.Router();

// Import all module routes
const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/user/user.routes');
const jobRoutes = require('../modules/job/job.routes');
const applicationRoutes = require('../modules/application/application.routes');

// Mount routes — every auth route starts with /api/auth
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);

module.exports = router;                                            