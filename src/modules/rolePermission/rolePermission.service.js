import * as rolePermissionRepo from './rolePermission.repository.js';
import AppError from '../../utils/appError.js';

export const createRolePermission = async (data) => {
  const existing = await rolePermissionRepo.findOne({
    role: data.role,
    resource: data.resource
  });
  
  if (existing) {
    throw new AppError('Permission already exists for this role and resource', 400);
  }
  
  return await rolePermissionRepo.create(data);
};

export const getRolePermissions = async (role) => {
  return await rolePermissionRepo.findByRole(role);
};

export const getAllRolePermissions = async () => {
  return await rolePermissionRepo.findAll();
};

export const updateRolePermission = async (role, resource, actions) => {
  const permission = await rolePermissionRepo.findOne({ role, resource });
  
  if (!permission) {
    return await rolePermissionRepo.create({ role, resource, actions });
  }
  
  return await rolePermissionRepo.update({ role, resource }, { actions });
};

export const deleteRolePermission = async (role, resource) => {
  const permission = await rolePermissionRepo.deleteOne({ role, resource });
  if (!permission) {
    throw new AppError('Permission not found', 404);
  }
  return permission;
};

export const getUserPermissions = async (role) => {
  const permissions = await rolePermissionRepo.findByRole(role);
  
  // Convert to map for easy lookup
  const permissionMap = {};
  permissions.forEach(perm => {
    permissionMap[perm.resource] = perm.actions;
  });
  
  return permissionMap;
};








