const Application = require('./application.model');
const Job = require('../job/job.model');
const ApiError = require('../../utils/ApiError');
const sendEmail = require('../../utils/sendEmail');

const applyForJob = async (candidateId, jobId, body, file) => {
  // Check job exists and is open
  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, 'Job not found');
  if (job.status === 'closed') throw new ApiError(400, 'This job is no longer accepting applications');

  // Check if already applied — the unique index will also catch this
  const existing = await Application.findOne({ job: jobId, candidate: candidateId });
  if (existing) throw new ApiError(409, 'You have already applied for this job');

  // file.path is set by Multer after upload
  if (!file) throw new ApiError(400, 'Resume is required');

  const application = await Application.create({
    job: jobId,
    candidate: candidateId,
    resumeUrl: file.path,
    coverLetter: body.coverLetter || '',
  });

  // Increment the job's application counter
  await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

  return application;
};

const getMyApplications = async (candidateId) => {
  const applications = await Application.find({ candidate: candidateId })
    .populate('job', 'title location jobType company status')
    .sort({ createdAt: -1 });
  return applications;
};

const getJobApplications = async (jobId, companyId, role) => {
  // Verify this company owns the job (unless admin)
  if (role !== 'admin') {
    const job = await Job.findOne({ _id: jobId, company: companyId });
    if (!job) throw new ApiError(403, 'Not authorized to view these applications');
  }

  const applications = await Application.find({ job: jobId })
    .populate('candidate', 'name email resumeUrl')
    .sort({ createdAt: -1 });

  return applications;
};

const updateApplicationStatus = async (applicationId, companyId, role, status) => {
  const application = await Application.findById(applicationId).populate('job candidate');
  if (!application) throw new ApiError(404, 'Application not found');

  // Only the job's company or admin can update status
  if (role !== 'admin' && String(application.job.company) !== String(companyId)) {
    throw new ApiError(403, 'Not authorized');
  }

  application.status = status;
  await application.save();

  // Send email notification to candidate
  const statusMessages = {
    reviewed: 'Your application is being reviewed.',
    accepted: '🎉 Congratulations! Your application has been accepted.',
    rejected: 'Unfortunately, your application was not selected.',
  };

  if (statusMessages[status]) {
    await sendEmail({
      to: application.candidate.email,
      subject: `Application Update: ${application.job.title}`,
      html: `
        <h2>Application Status Update</h2>
        <p>Hi ${application.candidate.name},</p>
        <p>${statusMessages[status]}</p>
        <p><strong>Job:</strong> ${application.job.title}</p>
      `,
    });
  }

  return application;
};

module.exports = { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus };