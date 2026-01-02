import Joi from 'joi';

export const createPaymentSchema = Joi.object({
  totalAmount: Joi.number().positive().required(),
  paidAmount: Joi.number().min(0).default(0),
  paymentMethod: Joi.string().valid('CASH', 'BANK_TRANSFER', 'BINANCE', 'OTHER').required(),
  paymentDate: Joi.date().default(Date.now),
  apartmentReference: Joi.string().hex().length(24).allow(null),
  assignedType: Joi.string().valid('ASSIGNED', 'MANUAL').default('MANUAL'),
  username: Joi.string().allow(null, ''),
  userEmail: Joi.string().email().allow(null, ''),
  ownerName: Joi.string().allow(null, ''),
  description: Joi.string().max(1000).allow('', null),
  notes: Joi.string().max(2000).allow('', null),
}).or('username', 'userEmail', 'ownerName');

export const updatePaymentSchema = Joi.object({
  totalAmount: Joi.number().positive(),
  paidAmount: Joi.number().min(0),
  paymentMethod: Joi.string().valid('CASH', 'BANK_TRANSFER', 'BINANCE', 'OTHER'),
  paymentDate: Joi.date(),
  apartmentReference: Joi.string().hex().length(24).allow(null),
  assignedType: Joi.string().valid('ASSIGNED', 'MANUAL'),
  username: Joi.string().allow(null, ''),
  userEmail: Joi.string().email().allow(null, ''),
  ownerName: Joi.string().allow(null, ''),
  description: Joi.string().max(1000).allow('', null),
  notes: Joi.string().max(2000).allow('', null),
  status: Joi.string().valid('PAID', 'UNPAID'),
});

