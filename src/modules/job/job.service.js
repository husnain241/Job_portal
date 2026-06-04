const Job = require('./job.model');
const ApiError = require('../../utils/ApiError');

const createJob = async (companyId, body) => {
  const job = await Job.create({ ...body, company: companyId });
  return job;
};

const getAllJobs = async (query) => {
  const {
    page = 1, limit = 10, search,
    location, jobType, category,
    salaryMin, salaryMax, sortBy = 'createdAt', order = 'desc',
  } = query;

  const filter = { status: 'open' };

  // Full-text search on title/description/location
  if (search) filter.$text = { $search: search };
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (jobType) filter.jobType = jobType;
  if (category) filter.category = { $regex: category, $options: 'i' };
  if (salaryMin) filter.salaryMin = { $gte: Number(salaryMin) };
  if (salaryMax) filter.salaryMax = { $lte: Number(salaryMax) };

  const skip = (page - 1) * limit;
  const sortOrder = order === 'asc' ? 1 : -1;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate('company', 'name companyName companyWebsite') // join user data
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit)),
    Job.countDocuments(filter),
  ]);

  return { jobs, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } };
};

const getJobById = async (jobId) => {
  const job = await Job.findById(jobId).populate('company', 'name companyName companyWebsite');
  if (!job) throw new ApiError(404, 'Job not found');
  return job;
};

const updateJob = async (jobId, companyId, body) => {
  const job = await Job.findOne({ _id: jobId, company: companyId });
  if (!job) throw new ApiError(404, 'Job not found or not authorized');

  Object.assign(job, body); // merge update fields into existing job
  await job.save();
  return job;
};

const deleteJob = async (jobId, companyId, role) => {
  const filter = role === 'admin' ? { _id: jobId } : { _id: jobId, company: companyId };
  const job = await Job.findOneAndDelete(filter);
  if (!job) throw new ApiError(404, 'Job not found or not authorized');
};

const getJobStats = async () => {
  // MongoDB Aggregation Pipeline
  const stats = await Job.aggregate([
    {
      // Stage 1: Group jobs by company, count total jobs and applications
      $group: {
        _id: '$company',
        totalJobs: { $sum: 1 },
        totalApplications: { $sum: '$applicationCount' },
      },
    },
    {
      // Stage 2: Join with users collection to get company name
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'companyInfo',
      },
    },
    {
      // Stage 3: Flatten the companyInfo array into a single object
      $unwind: '$companyInfo',
    },
    {
      // Stage 4: Shape the output fields
      $project: {
        companyName: '$companyInfo.companyName',
        totalJobs: 1,
        totalApplications: 1,
      },
    },
    { $sort: { totalJobs: -1 } }, // sort by most jobs
  ]);

  // Top 5 most applied jobs
  const topJobs = await Job.find()
    .sort({ applicationCount: -1 })
    .limit(5)
    .populate('company', 'companyName')
    .select('title applicationCount location jobType');

  return { stats, topJobs };
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob, getJobStats };