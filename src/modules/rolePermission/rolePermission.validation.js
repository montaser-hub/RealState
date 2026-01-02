import Joi from '../../utils/joiExtention.js';

export const createRolePermissionSchema = Joi.object({
  role: Joi.string()
    .valid('admin', 'manager', 'agent', 'broker', 'guest')
    .required()
    .messages({
      'any.required': 'Role is required.',
      'any.only': 'Invalid role.'
    }),
  
  resource: Joi.string()
    .valid('properties', 'contracts', 'users', 'payments', 'features', 'facilities', 'media', 'reminders')
    .required()
    .messages({
      'any.required': 'Resource is required.',
      'any.only': 'Invalid resource.'
    }),
  
  actions: Joi.array()
    .items(Joi.string().valid('read', 'create', 'update', 'delete'))
    .min(1)
    .required()
    .messages({
      'any.required': 'Actions are required.',
      'array.min': 'At least one action is required.'
    })
});

export const updateRolePermissionSchema = Joi.object({
  actions: Joi.array()
    .items(Joi.string().valid('read', 'create', 'update', 'delete'))
    .min(1)
    .required()
    .messages({
      'any.required': 'Actions are required.',
      'array.min': 'At least one action is required.'
    })
});


