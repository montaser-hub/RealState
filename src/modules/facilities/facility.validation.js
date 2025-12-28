import Joi from '../../utils/joiExtention.js';

export const createFacilitySchema = Joi.object({
  propertyId: Joi.objectId()
    .required()
    .messages({
      'any.required': 'Property reference is required.'
    }),

  elevator: Joi.boolean().optional(),
  electricity: Joi.boolean().optional(),

  parking: Joi.number().min(0).optional(),
  visitorParking: Joi.number().min(0).optional(),

  gym: Joi.boolean().optional(),
  pool: Joi.boolean().optional(),
  sauna: Joi.boolean().optional(),
  kidsArea: Joi.boolean().optional(),
  garden: Joi.boolean().optional(),

  executiveLounge: Joi.boolean().optional(),
  fullTimeConcierge: Joi.boolean().optional(),
  fullTimeSecurity: Joi.boolean().optional(),

  otherFacilities: Joi.array()
    .items(Joi.string().min(2).max(100))
    .max(50)
    .optional()
    .allow(null)
});

export const updateFacilitySchema = Joi.object({
  propertyId: Joi.objectId().optional(),

  elevator: Joi.boolean().optional(),
  electricity: Joi.boolean().optional(),

  parking: Joi.number().min(0).optional(),
  visitorParking: Joi.number().min(0).optional(),

  gym: Joi.boolean().optional(),
  pool: Joi.boolean().optional(),
  sauna: Joi.boolean().optional(),
  kidsArea: Joi.boolean().optional(),
  garden: Joi.boolean().optional(),

  executiveLounge: Joi.boolean().optional(),
  fullTimeConcierge: Joi.boolean().optional(),
  fullTimeSecurity: Joi.boolean().optional(),

  otherFacilities: Joi.array()
    .items(Joi.string().min(2).max(100))
    .max(50)
    .optional()
    .allow(null)
});
