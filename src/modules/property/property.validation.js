import Joi from '../../utils/joiExtention.js';

export const createPropertySchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'any.required': 'Title is required.',
      'string.min': 'Title must be at least 3 characters.',
      'string.max': 'Title cannot exceed 100 characters.'
    }),
  description: Joi.string().optional().allow('', null),
  referenceId: Joi.string().required().messages({
    'any.required': 'Reference ID is required.'
  }),
  owner: Joi.objectId().optional().messages({
    'any.required': 'Owner is required.'
  }),
  broker: Joi.objectId().optional(),
  category: Joi.string()
    .valid('apartment', 'shop', 'office', 'land', 'warehouse', 'villa', 'house', 'building', 'loft', 'tower', 'other')
    .required()
    .messages({
      'any.required': 'Category is required.',
      'any.only': 'Invalid category.'
    }),
  otherCategory: Joi.string().optional().allow('', null),
  parentProperty: Joi.objectId().optional(),
  listingType: Joi.string()
    .valid('rent', 'sale')
    .required()
    .messages({
      'any.required': 'Listing type is required.',
      'any.only': 'Invalid listing type.'
    }),
  city: Joi.string().optional().allow('', null),
  state: Joi.string().optional().allow('', null),
  zipCode: Joi.string().optional().allow('', null),
  country: Joi.string().optional().default('Lebanon'),
  location: Joi.object({
    type: Joi.string().valid('Point').required(),
    coordinates: Joi.array()
      .items(
        Joi.number().min(-180).max(180), // longitude
        Joi.number().min(-90).max(90)    // latitude
      )
      .length(2)
      .required()
      .messages({ 'array.length': 'Coordinates must have exactly [longitude, latitude].' })
  }).required(),
  size: Joi.object({
    value: Joi.number().min(0).required(),
    unit: Joi.string().valid('sqm').default('sqm')
  }).required(),
  floor: Joi.number().optional(),
  pricing: Joi.object({
    sale: Joi.object({
      amount: Joi.number().min(0).optional(),
      currency: Joi.string().valid('USD', 'EUR', 'LBP').default('USD'),
      negotiable: Joi.boolean().default(false)
    }).optional(),
    rent: Joi.object({
      amount: Joi.number().min(0).optional(),
      currency: Joi.string().valid('USD', 'EUR', 'LBP').default('USD'),
      period: Joi.string().valid('month', 'year', 'day').default('month'),
      negotiable: Joi.boolean().default(false)
    }).optional()
  }).optional(),
  furnishing: Joi.string()
    .valid('unfurnished', 'semi-furnished', 'furnished')
    .default('unfurnished'),
  status: Joi.string()
    .valid('available', 'pending', 'archived', 'sold', 'banned')
    .default('available')
});

export const updatePropertySchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().optional().allow('', null),
  referenceId: Joi.string().optional(),
  owner: Joi.objectId().optional(),
  broker: Joi.objectId().optional(),
  category: Joi.string()
    .valid('apartment', 'shop', 'office', 'land', 'warehouse', 'villa', 'house', 'building', 'loft', 'tower', 'other')
    .optional(),
  otherCategory: Joi.string().optional().allow('', null),
  parentProperty: Joi.objectId().optional(),
  listingType: Joi.string()
    .valid('rent', 'sale')
    .optional(),
  city: Joi.string().optional().allow('', null),
  state: Joi.string().optional().allow('', null),
  zipCode: Joi.string().optional().allow('', null),
  country: Joi.string().optional(),
  location: Joi.object({
    type: Joi.string().valid('Point').optional(),
    coordinates: Joi.array().items(
      Joi.number().min(-180).max(180),
      Joi.number().min(-90).max(90)
    ).length(2)
  }).optional(),
  size: Joi.object({
    value: Joi.number().min(0).optional(),
    unit: Joi.string().valid('sqm').optional()
  }).optional(),
  floor: Joi.number().optional(),
  pricing: Joi.object({
    sale: Joi.object({
      amount: Joi.number().min(0).optional(),
      currency: Joi.string().valid('USD', 'EUR', 'LBP').optional(),
      negotiable: Joi.boolean().optional()
    }).optional(),
    rent: Joi.object({
      amount: Joi.number().min(0).optional(),
      currency: Joi.string().valid('USD', 'EUR', 'LBP').optional(),
      period: Joi.string().valid('month', 'year', 'day').optional(),
      negotiable: Joi.boolean().optional()
    }).optional()
  }).optional(),
  furnishing: Joi.string().valid('unfurnished', 'semi-furnished', 'furnished').optional(),
  status: Joi.string().valid('available', 'pending', 'archived', 'sold', 'banned').optional()
});