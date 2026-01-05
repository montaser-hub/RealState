import Owner from './owner.model.js';

export const create = async (data) => {
  return await Owner.create(data);
};

export const findById = async (id) => {
  return await Owner.findById(id);
};

export const update = async (id, data) => {
  return await Owner.findByIdAndUpdate(id, data, { new: true });
};

export const deleteOne = async (id) => {
  return await Owner.findByIdAndDelete(id);
};

export const findOne = (filter) => {
  return Owner.find(filter);
};

export const findAll = () => {
  return Owner.find();
};

export const countAll = () => Owner.countDocuments();

export const countFiltered = (filter) => Owner.countDocuments(filter);

