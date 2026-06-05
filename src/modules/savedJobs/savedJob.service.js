const SavedJob = require('./savedJob.model');
const ApiError = require('../../utils/ApiError');


const saveJob = async (candidateId, jobId) => {
 // ✅ Pehle check karo
const existing = await SavedJob.findOne({ candidate: candidateId, job: jobId });
if (existing) throw new ApiError(400, 'Job already saved');

// ✅ Naya record banao
const savedJob = await SavedJob.create({ candidate: candidateId, job: jobId });
return savedJob;


};

const unsaveJob = async (candidateId, jobId) => {
  // ✅ Job unsave karo
  const unSavedJob = await SavedJob.findOneAndDelete({ candidate: candidateId, job: jobId });
  if (!unSavedJob) throw new ApiError(404, 'Saved job not found');
  return unSavedJob;
};

const getSavedJobs = async (candidateId) => {
  // ✅ Candidate ke saved jobs fetch karo
  const savedJobs = await SavedJob.find({ candidate: candidateId }).populate('job').sort({ createdAt: -1 });
  return savedJobs;
};

const isJobSaved = async (candidateId, jobId) => {
  const existing = await SavedJob.findOne({ candidate: candidateId, job: jobId });
  return !!existing; // true if saved, false if not
};

module.exports = { saveJob, unsaveJob, getSavedJobs, isJobSaved };

// Example usage:
// saveJob(candidateId, jobId); 
// unsaveJob(candidateId, jobId); 
// getSavedJobs(candidateId); 
