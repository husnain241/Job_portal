const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const jobService = require('./job.service');

const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, { job }, 'Job created successfully'));
});

const getAllJobs = asyncHandler(async (req, res) => {
  const result = await jobService.getAllJobs(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Jobs fetched'));
});

const getJobById = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  res.status(200).json(new ApiResponse(200, { job }, 'Job fetched'));
});

const updateJob = asyncHandler(async (req, res) => {
  const job = await jobService.updateJob(req.params.id, req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, { job }, 'Job updated'));
});

const deleteJob = asyncHandler(async (req, res) => {
  await jobService.deleteJob(req.params.id, req.user._id, req.user.role);
  res.status(200).json(new ApiResponse(200, null, 'Job deleted'));
});

const getJobStats = asyncHandler(async (req, res) => {
  const stats = await jobService.getJobStats();
  res.status(200).json(new ApiResponse(200, stats, 'Stats fetched'));
});

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob, getJobStats };