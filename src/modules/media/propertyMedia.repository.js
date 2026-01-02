import PropertyMedia from './propertyMedia.model.js';

export const create = async (data) => {
  return await PropertyMedia.create(data);
};

export const createMultiple = async (dataArray) => {
  return await PropertyMedia.insertMany(dataArray);
};

export const findById = async (id) => {
  return await PropertyMedia.findById(id).populate('property');
};

export const findByProperty = async (propertyId) => {
  return await PropertyMedia.find({ property: propertyId })
    .sort({ order: 1, createdAt: 1 });
};

export const update = async (id, data) => {
  return await PropertyMedia.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteOne = async (id) => {
  return await PropertyMedia.findByIdAndDelete(id);
};

export const deleteByProperty = async (propertyId) => {
  return await PropertyMedia.deleteMany({ property: propertyId });
};

export const setPrimary = async (propertyId, mediaId) => {
  // Remove primary from all media for this property
  await PropertyMedia.updateMany(
    { property: propertyId },
    { isPrimary: false }
  );
  
  // Set the selected one as primary
  return await PropertyMedia.findByIdAndUpdate(
    mediaId,
    { isPrimary: true },
    { new: true }
  );
};

export const reorder = async (propertyId, mediaIds) => {
  const updates = mediaIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id, property: propertyId },
      update: { order: index + 1 },
    },
  }));

  if (updates.length > 0) {
    await PropertyMedia.bulkWrite(updates);
  }
  return await PropertyMedia.find({ property: propertyId }).sort({ order: 1 });
};

