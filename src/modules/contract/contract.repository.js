import Contract from './contract.model.js';

export const create = async (data) => {
  return await Contract.create(data);
};

export const findById = async (id) => {
  return await Contract.findById(id)
};

export const update = async (id, data) => {
  return await Contract.findByIdAndUpdate(id, data, { new: true });
};

export const deleteOne = async (id) => {
  return Contract.findByIdAndDelete(id);
};

export const findOne = (filter) => {
  return Contract.find(filter)
};

export const findAll = () => {
  return Contract.find();
};

export const countAll = () => Contract.countDocuments();

export const countFiltered = (filter) => Contract.countDocuments(filter);