import Concierge from './concierge.model.js';

export const create = async (data) => {
  return await Concierge.create(data);
};

export const findById = async (id) => {
  return await Concierge.findById(id);
};

export const update = async (id, data) => {
  return await Concierge.findByIdAndUpdate(id, data, { new: true });
};

export const deleteOne = async (id) => {
  return await Concierge.findByIdAndDelete(id);
};

export const findOne = (filter) => {
  return Concierge.find(filter);
};

export const findAll = () => {
  return Concierge.find();
};

export const countAll = () => Concierge.countDocuments();

export const countFiltered = (filter) => Concierge.countDocuments(filter);

