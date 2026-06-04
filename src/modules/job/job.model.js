const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    company: {
      // References the User who posted this job (must have role: 'company')
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship', 'contract'],
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    salaryMin: {
      type: Number,
      default: 0,
    },

    salaryMax: {
      type: Number,
      default: 0,
    },

    skills: {
      // Array of required skills e.g. ["Node.js", "MongoDB"]
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },

    applicationCount: {
      // We increment this every time someone applies
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Text index — enables full-text search on title, description, location
jobSchema.index({ title: 'text', description: 'text', location: 'text' });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;