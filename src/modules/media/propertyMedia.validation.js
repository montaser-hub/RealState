import Joi from '../../utils/joiExtention.js';

export const createPropertyMediaSchema = Joi.object({
  // For single image
  caption: Joi.string()
    .optional()
    .allow(null, '')
    .max(500)
    .messages({
      'string.max': 'Caption cannot exceed 500 characters.',
    }),
  isPrimary: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'isPrimary must be a boolean.',
    }),
  // For multiple images
  captions: Joi.array()
    .items(Joi.string().max(500).allow(null, ''))
    .optional()
    .messages({
      'array.base': 'Captions must be an array.',
    }),
  primaryIndex: Joi.number()
    .integer()
    .min(0)
    .optional()
    .allow(null)
    .messages({
      'number.base': 'Primary index must be a number.',
      'number.integer': 'Primary index must be an integer.',
      'number.min': 'Primary index cannot be negative.',
    }),
});

export const reorderPropertyMediaSchema = Joi.object({
  mediaIds: Joi.array()
    .items(Joi.objectId())
    .required()
    .min(1)
    .messages({
      'array.base': 'mediaIds must be an array.',
      'any.required': 'mediaIds is required.',
      'array.min': 'At least one media ID is required.',
    }),
});
