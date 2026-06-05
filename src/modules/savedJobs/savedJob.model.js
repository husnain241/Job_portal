const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema(
  {
     candidate: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
    job: {
      // References the Job that was saved
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
savedJobSchema.index({ candidate: 1, job: 1 }, { unique: true });

const SavedJob = mongoose.model('SavedJob', savedJobSchema);

module.exports = SavedJob;