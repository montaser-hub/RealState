import Facility from './facility.model.js';

export const create = async (data) => {
  return await Facility.create(data);
};

export const findById = async (id) => {
  return await Facility.findById(id)
};

export const update = async (id, data) => {
  return await Facility.findByIdAndUpdate(id, data, { new: true });
};

export const deleteOne = async (id) => {
  return Facility.findByIdAndDelete(id);
};

export const findAll = () => {
  return Facility.find();
};

export const findOne = (filter) => {
  return Facility.findOne( filter );
};

export const countAll = () => Facility.countDocuments();

export const countFiltered = (filter) => Facility.countDocuments(filter);