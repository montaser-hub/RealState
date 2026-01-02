import PaymentHistory from './paymentHistory.model.js';

export const create = async (data) => {
  return await PaymentHistory.create(data);
};

export const findByPaymentId = async (paymentId) => {
  return await PaymentHistory.find({ paymentId })
    .populate('changedBy', 'firstName lastName fullName email')
    .sort({ changeDate: -1 });
};

export const findById = async (id) => {
  return await PaymentHistory.findById(id)
    .populate('changedBy', 'firstName lastName fullName email');
};

export const deleteByPaymentId = async (paymentId) => {
  return await PaymentHistory.deleteMany({ paymentId });
};

