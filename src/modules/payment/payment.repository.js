import Payment from './payment.model.js';

export const create = async (data) => {
  const payment = await Payment.create(data);
  return await Payment.findById(payment._id)
    .populate('apartmentReference', 'title referenceId')
    .populate('user', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate('changes.changedBy', 'firstName lastName fullName email');
};

export const findById = async (id) => {
  return await Payment.findById(id)
    .populate('apartmentReference', 'title referenceId')
    .populate('user', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate('changes.changedBy', 'firstName lastName fullName email');
};

export const update = async (id, data) => {
  return await Payment.findByIdAndUpdate(id, data, { new: true })
    .populate('apartmentReference', 'title referenceId')
    .populate('user', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate('changes.changedBy', 'firstName lastName fullName email');
};

export const deleteOne = async (id) => {
  return await Payment.findByIdAndDelete(id);
};

export const findOne = (filter) => {
  return Payment.find(filter)
    .populate('apartmentReference', 'title referenceId')
    .populate('user', 'firstName lastName fullName email contactNumber AlternativePhone');
};

export const findAll = () => {
  return Payment.find()
    .populate('apartmentReference', 'title referenceId')
    .populate('user', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate('changes.changedBy', 'firstName lastName fullName email');
};

export const countAll = () => Payment.countDocuments();

export const countFiltered = (filter) => Payment.countDocuments(filter);



