import Joi from '../../utils/joiExtention.js';

export const createReminderSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .required()
    .messages({
      'any.required': 'Title is required.',
      'string.empty': 'Title cannot be empty.',
      'string.max': 'Title cannot exceed 200 characters.'
    }),

  description: Joi.string()
    .trim()
    .min(1)
    .max(1000)
    .required()
    .messages({
      'any.required': 'Description is required.',
      'string.empty': 'Description cannot be empty.',
      'string.max': 'Description cannot exceed 1000 characters.'
    }),

  date: Joi.date()
    .iso()
    .required()
    .messages({
      'any.required': 'Date is required.',
      'date.format': 'Date must be a valid ISO date.'
    }),

  time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      'any.required': 'Time is required.',
      'string.pattern.base': 'Time must be in HH:MM format (e.g., 14:30).'
    }),

  category: Joi.string()
    .valid('Property Showing', 'Client Follow-up', 'Meeting', 'Deadline', 'Others')
    .required()
    .messages({
      'any.required': 'Category is required.',
      'any.only': 'Category must be one of: Property Showing, Client Follow-up, Meeting, Deadline, Others.'
    }),

  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .optional()
    .default('medium')
    .messages({
      'any.only': 'Priority must be low, medium, or high.'
    }),

  notes: Joi.string()
    .trim()
    .max(2000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Notes cannot exceed 2000 characters.'
    })
})
.options({ abortEarly: false });

export const updateReminderSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .optional()
    .messages({
      'string.empty': 'Title cannot be empty.',
      'string.max': 'Title cannot exceed 200 characters.'
    }),

  description: Joi.string()
    .trim()
    .min(1)
    .max(1000)
    .optional()
    .messages({
      'string.empty': 'Description cannot be empty.',
      'string.max': 'Description cannot exceed 1000 characters.'
    }),

  date: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'Date must be a valid ISO date.'
    }),

  time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional()
    .messages({
      'string.pattern.base': 'Time must be in HH:MM format (e.g., 14:30).'
    }),

  category: Joi.string()
    .valid('Property Showing', 'Client Follow-up', 'Meeting', 'Deadline', 'Others')
    .optional()
    .messages({
      'any.only': 'Category must be one of: Property Showing, Client Follow-up, Meeting, Deadline, Others.'
    }),

  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .optional()
    .messages({
      'any.only': 'Priority must be low, medium, or high.'
    }),

  notes: Joi.string()
    .trim()
    .max(2000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Notes cannot exceed 2000 characters.'
    })
})
.options({ abortEarly: false });






