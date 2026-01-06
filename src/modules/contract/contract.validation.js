import Joi from '../../utils/joiExtention.js';

export const createContractSchema = Joi.object({
  contractNumber: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      'any.required': 'Contract number is required.',
      'string.empty': 'Contract number cannot be empty.',
    }),

  propertyId: Joi.objectId()
    .required()
    .messages({
      'any.required': 'Property reference is required.',
    }),

  startDate: Joi.date()
    .iso()
    .required()
    .messages({
      'any.required': 'Start date is required.',
      'date.format': 'Start date must be a valid ISO date.',
    }),

  endDate: Joi.date()
    .iso()
    .greater(Joi.ref('startDate'))
    .required()
    .messages({
      'any.required': 'End date is required.',
      'date.greater': 'End date must be after start date.',
    }),

  documentUrl: Joi.string()
    .uri()
    .optional()
    .allow('', null)
    .messages({
      'string.uri': 'Document URL must be a valid URL.',
    }),

  documentFile: Joi.string()
    .optional()
    .allow('', null),

  user: Joi.objectId()
    .required()
    .messages({
      'any.required': 'Contract user is required.',
      'any.invalid': 'Invalid user ID.',
    }),

  client: Joi.objectId()
    .optional()
    .allow('', null)
    .messages({
      'any.invalid': 'Invalid client user ID.',
    }),

  amount: Joi.number()
    .min(0)
    .required()
    .messages({
      'any.required': 'Contract amount is required.',
      'number.min': 'Amount must be greater than or equal to 0.',
    }),

  depositAmount: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Deposit amount must be greater than or equal to 0.',
    }),

  currency: Joi.string()
    .valid('USD', 'EUR', 'LBP')
    .optional()
    .messages({
      'any.only': 'Currency must be USD, EUR, or LBP.',
    }),

  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow('')
})
.options({ abortEarly: false });


export const updateContractSchema = Joi.object({
  contractNumber: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .optional(),

  propertyId: Joi.objectId().optional(),

  startDate: Joi.date()
    .iso()
    .optional(),

  endDate: Joi.date()
    .iso()
    .greater(Joi.ref('startDate'))
    .optional()
    .messages({
      'date.greater': 'End date must be after start date.',
    }),

  status: Joi.string()
    .valid('draft', 'active', 'expired', 'terminated', 'renewed', 'cancelled')
    .optional()
    .messages({
      'any.only': 'Invalid contract status.',
    }),

  documentUrl: Joi.string()
    .uri()
    .optional()
    .allow('', null)
    .messages({
      'string.uri': 'Document URL must be a valid URL.',
    }),

  documentFile: Joi.string()
    .optional()
    .allow('', null),

  user: Joi.objectId()
    .optional()
    .messages({
      'any.invalid': 'Invalid user ID.',
    }),

  client: Joi.objectId()
    .optional()
    .allow('', null)
    .messages({
      'any.invalid': 'Invalid client user ID.',
    }),

  amount: Joi.number()
    .min(0)
    .optional(),

  depositAmount: Joi.number()
    .min(0)
    .optional(),

  currency: Joi.string()
    .valid('USD', 'EUR', 'LBP')
    .optional(),

  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow('')
})


export const updateContractStatusSchema = Joi.object({
  status: Joi.string()
    .valid('draft', 'active', 'expired', 'terminated', 'renewed', 'cancelled')
    .required()
    .messages({
      'any.required': 'Contract status is required.',
      'any.only': 'Invalid contract status.',
    }),
})