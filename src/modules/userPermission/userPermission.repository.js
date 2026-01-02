import UserPermission from './userPermission.model.js';

export const create = async (data) => {
  const permission = await UserPermission.create(data);
  return await UserPermission.findById(permission._id)
    .populate('userId', 'email firstName lastName role nickname fullName');
};

export const findOne = async (filter) => {
  return await UserPermission.findOne(filter)
    .populate('userId', 'email firstName lastName role nickname fullName');
};

export const findAll = async (filter = {}) => {
  return await UserPermission.find(filter)
    .populate('userId', 'email firstName lastName role nickname fullName')
    .lean();
};

export const update = async (filter, data) => {
  return await UserPermission.findOneAndUpdate(filter, data, { new: true })
    .populate('userId', 'email firstName lastName role nickname fullName');
};

export const deleteOne = async (filter) => {
  const permission = await UserPermission.findOne(filter)
    .populate('userId', 'email firstName lastName role nickname fullName');
  if (permission) {
    await UserPermission.deleteOne(filter);
  }
  return permission;
};

export const findByUserId = async (userId) => {
  return await UserPermission.find({ userId })
    .populate('userId', 'email firstName lastName role nickname fullName');
};

export const findByUserIdAndResource = async (userId, resource) => {
  return await UserPermission.findOne({ userId, resource })
    .populate('userId', 'email firstName lastName role nickname fullName');
};

