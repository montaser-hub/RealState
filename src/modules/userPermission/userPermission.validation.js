import Joi from '../../utils/joiExtention.js';

export const createUserPermissionSchema = Joi.object({
  userId: Joi.objectId()
    .required()
    .messages({
      'any.required': 'User ID is required.',
      'any.invalid': 'Invalid user ID.'
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

export const updateUserPermissionSchema = Joi.object({
  actions: Joi.array()
    .items(Joi.string().valid('read', 'create', 'update', 'delete'))
    .min(1)
    .required()
    .messages({
      'any.required': 'Actions are required.',
      'array.min': 'At least one action is required.'
    })
});


