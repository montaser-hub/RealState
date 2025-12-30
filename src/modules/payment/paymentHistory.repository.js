import PaymentHistory from './paymentHistory.model.js';

export const create = async (data) => {
  return await PaymentHistory.create(data);
};

export const findByPayment = async (paymentId) => {
  return await PaymentHistory.find({ payment: paymentId })
    .populate('changedBy', 'firstName lastName fullName email')
    .sort({ changeDate: -1 });
};

export const findById = async (id) => {
  return await PaymentHistory.findById(id)
    .populate('payment')
    .populate('changedBy', 'firstName lastName fullName email');
};

export const findAll = () => {
  return PaymentHistory.find()
    .populate('payment')
    .populate('changedBy', 'firstName lastName fullName email')
    .sort({ changeDate: -1 });
};

