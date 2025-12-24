import Property from './property.model.js';

export const create = async (data) => {
  return await Property.create(data);
};

export const findById = async (id) => {
  return await Property.findById(id)
    .populate('owner', 'firstName lastName fullName')
    .populate('broker', 'firstName lastName fullName');
};

export const update = async (id, data) => {
  return await Property.findByIdAndUpdate(id, data, { new: true });
};

export const deleteOne = async (id) => {
  return Property.findByIdAndDelete(id);
};

export const findAll = async () => {
  return Property.find()
    .populate('owner', 'firstName lastName fullName')
    .populate( 'broker', 'firstName lastName fullName' );
};

export const countAll = () => Property.countDocuments();

export const countFiltered = (filter) => Property.countDocuments(filter);