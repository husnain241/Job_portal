const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const applicationService = require('./application.service');

const applyForJob = asyncHandler(async (req, res) => {
  const application = await applicationService.applyForJob(
    req.user._id, req.params.jobId, req.body, req.file
  );
  res.status(201).json(new ApiResponse(201, { application }, 'Application submitted'));
});

const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await applicationService.getMyApplications(req.user._id);
  res.status(200).json(new ApiResponse(200, { applications }, 'Applications fetched'));
});

const getJobApplications = asyncHandler(async (req, res) => {
  const applications = await applicationService.getJobApplications(
    req.params.jobId, req.user._id, req.user.role
  );
  res.status(200).json(new ApiResponse(200, { applications }, 'Applicants fetched'));
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await applicationService.updateApplicationStatus(
    req.params.id, req.user._id, req.user.role, req.body.status
  );
  res.status(200).json(new ApiResponse(200, { application }, 'Status updated'));
});

module.exports = { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus };