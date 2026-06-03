const Joi = require('joi');

// registerSchema defines the rules for the registration request body
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required',
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),

  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),

  role: Joi.string().valid('candidate', 'company').default('candidate'),

  companyName: Joi.when('role', {
    is: 'company',
    // if role is 'company', companyName becomes required
    then: Joi.string().required().messages({
      'any.required': 'Company name is required for company accounts',
    }),
    otherwise: Joi.string().optional(),
  }),

  companyWebsite: Joi.string().uri().optional().messages({
    'string.uri': 'Please provide a valid URL',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required().messages({
    'string.length': 'OTP must be exactly 6 characters',
  }),
  newPassword: Joi.string().min(6).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};