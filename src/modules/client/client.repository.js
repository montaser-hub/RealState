import Client from './client.model.js';

export const create = async (data) => {
  return await Client.create(data);
};

export const findById = async (id) => {
  return await Client.findById(id);
};

export const update = async (id, data) => {
  return await Client.findByIdAndUpdate(id, data, { new: true });
};

export const deleteOne = async (id) => {
  return await Client.findByIdAndDelete(id);
};

export const findOne = (filter) => {
  return Client.find(filter);
};

export const findAll = () => {
  return Client.find();
};

export const countAll = () => Client.countDocuments();

export const countFiltered = (filter) => Client.countDocuments(filter);

