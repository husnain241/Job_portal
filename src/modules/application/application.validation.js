const Joi = require('joi');

const applyJobSchema = Joi.object({
  coverLetter: Joi.string().max(1000).optional(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'reviewed', 'accepted', 'rejected')
    .required(),
});

module.exports = { applyJobSchema, updateStatusSchema };