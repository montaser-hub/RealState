import Payment from './payment.model.js';

export const create = async (data) => {
  return await Payment.create(data);
};

export const findById = async (id) => {
  return await Payment.findById(id)
    .populate('user', 'firstName lastName fullName email nickname')
    .populate('apartmentReference', 'title referenceId category')
    .populate('history');
};

export const update = async (id, data) => {
  return await Payment.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('user', 'firstName lastName fullName email nickname')
    .populate('apartmentReference', 'title referenceId category');
};

export const deleteOne = async (id) => {
  return await Payment.findByIdAndDelete(id);
};

export const softDelete = async (id) => {
  return await Payment.findByIdAndUpdate(id, { deletedAt: Date.now() }, { new: true });
};

export const findAll = () => {
  return Payment.find({ deletedAt: null })
    .populate('user', 'firstName lastName fullName email nickname')
    .populate('apartmentReference', 'title referenceId category')
    .sort({ paymentDate: -1, createdAt: -1 });
};

export const countAll = () => {
  return Payment.countDocuments({ deletedAt: null });
};

export const countFiltered = (filter) => {
  return Payment.countDocuments({ ...filter, deletedAt: null });
};

