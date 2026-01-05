import Joi from '../../utils/joiExtention.js';

export const createOwnerSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'any.required': 'First name is required.',
      'string.empty': 'First name cannot be empty.',
      'string.min': 'First name must be at least 2 characters.',
      'string.max': 'First name cannot exceed 50 characters.'
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'any.required': 'Last name is required.',
      'string.empty': 'Last name cannot be empty.',
      'string.min': 'Last name must be at least 2 characters.',
      'string.max': 'Last name cannot exceed 50 characters.'
    }),
  email: Joi.string()
    .email()
    .optional()
    .allow('', null)
    .messages({
      'string.email': 'Invalid email format.'
    }),
  contactNumber: Joi.string()
    .optional()
    .allow('', null),
  alternativePhone: Joi.string()
    .optional()
    .allow('', null),
  dateOfBirth: Joi.date()
    .optional()
    .allow(null)
    .messages({
      'date.base': 'Date of birth must be a valid date.'
    }),
  photo: Joi.string()
    .optional()
    .allow('', null),
  status: Joi.string()
    .valid('active', 'inactive', 'deleted')
    .optional()
    .default('active')
    .messages({
      'any.only': 'Status must be active, inactive, or deleted.'
    }),
  notes: Joi.string()
    .trim()
    .max(2000)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'Notes cannot exceed 2000 characters.'
    }),
});

export const updateOwnerSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'First name must be at least 2 characters.',
      'string.max': 'First name cannot exceed 50 characters.'
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Last name must be at least 2 characters.',
      'string.max': 'Last name cannot exceed 50 characters.'
    }),
  email: Joi.string()
    .email()
    .optional()
    .allow('', null)
    .messages({
      'string.email': 'Invalid email format.'
    }),
  contactNumber: Joi.string()
    .optional()
    .allow('', null),
  alternativePhone: Joi.string()
    .optional()
    .allow('', null),
  dateOfBirth: Joi.date()
    .optional()
    .allow(null)
    .messages({
      'date.base': 'Date of birth must be a valid date.'
    }),
  photo: Joi.string()
    .optional()
    .allow('', null),
  status: Joi.string()
    .valid('active', 'inactive', 'deleted')
    .optional()
    .messages({
      'any.only': 'Status must be active, inactive, or deleted.'
    }),
  notes: Joi.string()
    .trim()
    .max(2000)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'Notes cannot exceed 2000 characters.'
    }),
});

