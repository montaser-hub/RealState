import Contract from './contract.model.js';

export const create = async (data) => {
  const contract = await Contract.create(data);
  return await Contract.findById(contract._id)
    .populate('realOwner', 'firstName lastName fullName email contactNumber alternativePhone')
    .populate('realClient', 'firstName lastName fullName email contactNumber alternativePhone')
    .populate('realConcierge', 'firstName lastName fullName email contactNumber alternativePhone')
    .populate({
      path: 'propertyId',
      select: 'title referenceId category listingType',
      populate: [
        {
        path: 'owner',
        select: 'firstName lastName fullName email contactNumber AlternativePhone'
        },
        {
          path: 'realOwner',
          select: 'firstName lastName fullName email contactNumber alternativePhone'
        },
        {
          path: 'realClient',
          select: 'firstName lastName fullName email contactNumber alternativePhone'
        },
        {
          path: 'realConcierge',
          select: 'firstName lastName fullName email contactNumber alternativePhone'
        }
      ]
    });
};

export const findById = async (id) => {
  return await Contract.findById(id)
    .populate('realOwner', 'firstName lastName fullName email contactNumber alternativePhone')
    .populate('realClient', 'firstName lastName fullName email contactNumber alternativePhone')
    .populate('realConcierge', 'firstName lastName fullName email contactNumber alternativePhone')
    .populate({
      path: 'propertyId',
      select: 'title referenceId category listingType',
      populate: [
        {
        path: 'owner',
        select: 'firstName lastName fullName email contactNumber AlternativePhone'
        },
        {
          path: 'realOwner',
          select: 'firstName lastName fullName email contactNumber alternativePhone'
        },
        {
          path: 'realClient',
          select: 'firstName lastName fullName email contactNumber alternativePhone'
        },
        {
          path: 'realConcierge',
          select: 'firstName lastName fullName email contactNumber alternativePhone'
        }
      ]
    });
};

export const update = async (id, data) => {
  return await Contract.findByIdAndUpdate(id, data, { new: true })
    .populate('realOwner', 'firstName lastName fullName email contactNumber alternativePhone')
    .populate('realClient', 'firstName lastName fullName email contactNumber alternativePhone')
    .populate('realConcierge', 'firstName lastName fullName email contactNumber alternativePhone')
    .populate({
      path: 'propertyId',
      select: 'title referenceId category listingType',
      populate: [
        {
        path: 'owner',
        select: 'firstName lastName fullName email contactNumber AlternativePhone'
        },
        {
          path: 'realOwner',
          select: 'firstName lastName fullName email contactNumber alternativePhone'
        },
        {
          path: 'realClient',
          select: 'firstName lastName fullName email contactNumber alternativePhone'
        },
        {
          path: 'realConcierge',
          select: 'firstName lastName fullName email contactNumber alternativePhone'
        }
      ]
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
    .populate('realOwner', 'firstName lastName fullName email contactNumber alternativePhone')
    .populate('realClient', 'firstName lastName fullName email contactNumber alternativePhone')
    .populate('realConcierge', 'firstName lastName fullName email contactNumber alternativePhone')
    .populate({
      path: 'propertyId',
      select: 'title referenceId category listingType',
      populate: [
        {
          path: 'owner',
          select: 'firstName lastName fullName email contactNumber AlternativePhone'
        },
        {
          path: 'realOwner',
          select: 'firstName lastName fullName email contactNumber alternativePhone'
        },
        {
          path: 'realClient',
          select: 'firstName lastName fullName email contactNumber alternativePhone'
        },
        {
          path: 'realConcierge',
          select: 'firstName lastName fullName email contactNumber alternativePhone'
        }
      ]
    });
};

export const countAll = () => Contract.countDocuments();

export const countFiltered = (filter) => Contract.countDocuments(filter);