import Feature from './feature.model.js';

export const create = async (data) => {
  return await Feature.create(data);
};

export const findById = async (id) => {
  return await Feature.findById(id)
};

export const update = async (id, data) => {
  return await Feature.findByIdAndUpdate(id, data, { new: true });
};

export const deleteOne = async (id) => {
  return Feature.findByIdAndDelete(id);
};

export const findAll = () => {
  return Feature.find();
};

export const countAll = () => Feature.countDocuments();

export const countFiltered = (filter) => Feature.countDocuments(filter);