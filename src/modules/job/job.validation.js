const Joi = require('joi');

const createJobSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(20).required(),
  location: Joi.string().required(),
  jobType: Joi.string()
    .valid('full-time', 'part-time', 'remote', 'internship', 'contract')
    .required(),
  category: Joi.string().required(),
  salaryMin: Joi.number().min(0).default(0),
  salaryMax: Joi.number().min(0).default(0),
  skills: Joi.array().items(Joi.string()).default([]),
});

const updateJobSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(20),
  location: Joi.string(),
  jobType: Joi.string().valid('full-time', 'part-time', 'remote', 'internship', 'contract'),
  category: Joi.string(),
  salaryMin: Joi.number().min(0),
  salaryMax: Joi.number().min(0),
  skills: Joi.array().items(Joi.string()),
  status: Joi.string().valid('open', 'closed'),
});

module.exports = { createJobSchema, updateJobSchema };