const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const SavedJobService = require('./savedJob.service');

const saveJob = asyncHandler(async (req, res) => {
  const savedJob = await SavedJobService.saveJob(req.user._id, req.params.jobId);
  res.status(201).json(new ApiResponse(201, { savedJob }, 'Job saved successfully'));
});

const unsaveJob = asyncHandler(async (req, res) => {
  const unSavedJob = await SavedJobService.unsaveJob(req.user._id, req.params.jobId);
  res.status(200).json(new ApiResponse(200, { unSavedJob }, 'Job unsaved successfully'));
});

const getSavedJobs = asyncHandler(async (req, res) => {
  const savedJobs = await SavedJobService.getSavedJobs(req.user._id);
  res.status(200).json(new ApiResponse(200, { savedJobs }, 'Saved jobs fetched successfully'));
}
);

const isJobSaved = asyncHandler(async (req, res) => {
  const saved = await SavedJobService.isJobSaved(req.user._id, req.params.jobId);
  res.status(200).json(new ApiResponse(200, { saved }, 'Job saved status fetched successfully'));
}); 

module.exports = { saveJob, unsaveJob, getSavedJobs, isJobSaved };