import Joi from '../../utils/joiExtention.js';

export const createFeatureSchema = Joi.object({
  propertyId: Joi.objectId()
    .required()
    .messages({
      'any.required': 'Property reference is required.'
    }),

  rooms: Joi.object({
    bedrooms: Joi.number().min(0).optional(),
    bathrooms: Joi.number().min(0).optional(),
    masterBedrooms: Joi.number().min(0).optional(),
    kitchen: Joi.boolean().optional(),
    livingRoom: Joi.boolean().optional(),
    diningRoom: Joi.boolean().optional(),
    maidsRoom: Joi.boolean().optional(),

    balcony: Joi.object({
      present: Joi.boolean().required(),
      size: Joi.when('present', {
        is: true,
        then: Joi.number().min(0).required(),
        otherwise: Joi.forbidden()
      })
    }).optional()
  }).optional(),

  buildingInfo: Joi.object({
    age: Joi.number().min(0).optional(),
    totalFloors: Joi.number().min(1).optional(),
    apartmentsPerFloor: Joi.number().min(1).optional()
  }).optional(),

  otherFeatures: Joi.alternatives().try(
  Joi.object().unknown(true),
    Joi.array().items( Joi.string() )
  ).optional().allow('', null)
});

export const updateFeatureSchema = Joi.object({
  propertyId: Joi.objectId().optional(),

  rooms: Joi.object({
    bedrooms: Joi.number().min(0).optional(),
    bathrooms: Joi.number().min(0).optional(),
    masterBedrooms: Joi.number().min(0).optional(),
    kitchen: Joi.boolean().optional(),
    livingRoom: Joi.boolean().optional(),
    diningRoom: Joi.boolean().optional(),
    maidsRoom: Joi.boolean().optional(),

    balcony: Joi.object({
      present: Joi.boolean().optional(),
      size: Joi.number().min(0).optional()
    }).optional()
  }).optional(),

  buildingInfo: Joi.object({
    age: Joi.number().min(0).optional(),
    totalFloors: Joi.number().min(1).optional(),
    apartmentsPerFloor: Joi.number().min(1).optional()
  }).optional(),

  otherFeatures: Joi.alternatives().try(
  Joi.object().unknown(true),
    Joi.array().items( Joi.string() )
  ).optional().allow( '', null )
});