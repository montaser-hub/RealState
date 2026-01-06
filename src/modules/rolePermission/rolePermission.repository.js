import RolePermission from './rolePermission.model.js';

export const create = async (data) => {
  return await RolePermission.create(data);
};

export const findOne = async (filter) => {
  return await RolePermission.findOne(filter);
};

export const findAll = async (filter = {}) => {
  return await RolePermission.find(filter);
};

export const update = async (filter, data) => {
  return await RolePermission.findOneAndUpdate(filter, data, { new: true });
};

export const deleteOne = async (filter) => {
  return await RolePermission.findOneAndDelete(filter);
};

export const findByRole = async (role) => {
  return await RolePermission.find({ role });
};

export const findByRoleAndResource = async (role, resource) => {
  return await RolePermission.findOne({ role, resource });
};








