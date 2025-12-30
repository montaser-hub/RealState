import Joi from '../../utils/joiExtention.js';

export const createPaymentSchema = Joi.object({
  paymentDate: Joi.date()
    .optional()
    .default(() => new Date())
    .messages({
      'date.base': 'Payment date must be a valid date.',
    }),
  totalAmount: Joi.number()
    .positive()
    .required()
    .messages({
      'any.required': 'Total amount is required.',
      'number.positive': 'Total amount must be a positive number.',
      'number.base': 'Total amount must be a number.',
    }),
  paidAmount: Joi.number()
    .min(0)
    .optional()
    .default(0)
    .messages({
      'number.min': 'Paid amount cannot be negative.',
      'number.base': 'Paid amount must be a number.',
    }),
  status: Joi.string()
    .valid('PAID', 'UNPAID')
    .optional()
    .messages({
      'any.only': 'Status must be either PAID or UNPAID.',
    }),
  paymentMethod: Joi.string()
    .valid('CASH', 'BANK_TRANSFER', 'BINANCE')
    .required()
    .messages({
      'any.required': 'Payment method is required.',
      'any.only': 'Payment method must be CASH, BANK_TRANSFER, or BINANCE.',
    }),
  apartmentReference: Joi.objectId()
    .optional()
    .allow(null, '')
    .messages({
      'objectId.base': 'Apartment reference must be a valid ObjectId.',
    }),
  assignedType: Joi.string()
    .valid('ASSIGNED', 'MANUAL')
    .optional()
    .default('MANUAL')
    .messages({
      'any.only': 'Assigned type must be either ASSIGNED or MANUAL.',
    }),
  // At least one ownership identifier required
  username: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Username must be a string.',
    }),
  userEmail: Joi.string()
    .email()
    .optional()
    .allow(null, '')
    .lowercase()
    .messages({
      'string.email': 'User email must be a valid email address.',
    }),
  ownerName: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Owner name must be a string.',
    }),
  notes: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Notes must be a string.',
    }),
}).or('username', 'userEmail', 'ownerName')
  .messages({
    'object.missing': 'At least one ownership identifier (username, userEmail, or ownerName) is required.',
  })
  .custom((value, helpers) => {
    // Validate paid amount doesn't exceed total amount
    if (value.paidAmount !== undefined && value.totalAmount !== undefined) {
      if (value.paidAmount > value.totalAmount) {
        return helpers.error('custom.paidAmountExceedsTotal');
      }
    }
    return value;
  })
  .messages({
    'custom.paidAmountExceedsTotal': 'Paid amount cannot exceed total amount.',
  });

export const updatePaymentSchema = Joi.object({
  paymentDate: Joi.date()
    .optional()
    .messages({
      'date.base': 'Payment date must be a valid date.',
    }),
  totalAmount: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.positive': 'Total amount must be a positive number.',
      'number.base': 'Total amount must be a number.',
    }),
  paidAmount: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Paid amount cannot be negative.',
      'number.base': 'Paid amount must be a number.',
    }),
  status: Joi.string()
    .valid('PAID', 'UNPAID')
    .optional()
    .messages({
      'any.only': 'Status must be either PAID or UNPAID.',
    }),
  paymentMethod: Joi.string()
    .valid('CASH', 'BANK_TRANSFER', 'BINANCE')
    .optional()
    .messages({
      'any.only': 'Payment method must be CASH, BANK_TRANSFER, or BINANCE.',
    }),
  apartmentReference: Joi.objectId()
    .optional()
    .allow(null, '')
    .messages({
      'objectId.base': 'Apartment reference must be a valid ObjectId.',
    }),
  assignedType: Joi.string()
    .valid('ASSIGNED', 'MANUAL')
    .optional()
    .messages({
      'any.only': 'Assigned type must be either ASSIGNED or MANUAL.',
    }),
  username: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Username must be a string.',
    }),
  userEmail: Joi.string()
    .email()
    .optional()
    .allow(null, '')
    .lowercase()
    .messages({
      'string.email': 'User email must be a valid email address.',
    }),
  ownerName: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Owner name must be a string.',
    }),
  reason: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Reason must be a string.',
    }),
  notes: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'Notes must be a string.',
    }),
});

