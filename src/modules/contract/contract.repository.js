import Contract from './contract.model.js';

export const create = async (data) => {
  const contract = await Contract.create(data);
  return await Contract.findById(contract._id)
    .populate({
      path: 'propertyId',
      select: 'title referenceId category listingType',
      populate: {
        path: 'owner',
        select: 'firstName lastName fullName email contactNumber AlternativePhone'
      }
    });
};

export const findById = async (id) => {
  return await Contract.findById(id)
    .populate({
      path: 'propertyId',
      select: 'title referenceId category listingType',
      populate: {
        path: 'owner',
        select: 'firstName lastName fullName email contactNumber AlternativePhone'
      }
    });
};

export const update = async (id, data) => {
  return await Contract.findByIdAndUpdate(id, data, { new: true })
    .populate({
      path: 'propertyId',
      select: 'title referenceId category listingType',
      populate: {
        path: 'owner',
        select: 'firstName lastName fullName email contactNumber AlternativePhone'
      }
    });
};

export const deleteOne = async (id) => {
  return Contract.findByIdAndDelete(id);
};

export const findOne = (filter) => {
  return Contract.find(filter)
};

export const findAll = () => {
  return Contract.find()
    .populate({
      path: 'propertyId',
      select: 'title referenceId category listingType',
      populate: {
        path: 'owner',
        select: 'firstName lastName fullName email contactNumber AlternativePhone'
      }
    });
};

export const countAll = () => Contract.countDocuments();

export const countFiltered = (filter) => Contract.countDocuments(filter);