import * as userPermissionRepo from './userPermission.repository.js';
import * as userRepo from '../user/user.repository.js';
import AppError from '../../utils/appError.js';

export const createUserPermission = async (data) => {
  // Verify user exists
  const user = await userRepo.findById(data.userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const existing = await userPermissionRepo.findOne({
    userId: data.userId,
    resource: data.resource
  });
  
  if (existing) {
    throw new AppError('Permission already exists for this user and resource', 400);
  }
  
  return await userPermissionRepo.create(data);
};

export const getUserPermissions = async (userId) => {
  return await userPermissionRepo.findByUserId(userId);
};

export const getAllUserPermissions = async () => {
  return await userPermissionRepo.findAll();
};

export const updateUserPermission = async (userId, resource, actions) => {
  const permission = await userPermissionRepo.findOne({ userId, resource });
  
  if (!permission) {
    return await userPermissionRepo.create({ userId, resource, actions });
  }
  
  return await userPermissionRepo.update({ userId, resource }, { actions });
};

export const deleteUserPermission = async (userId, resource) => {
  const permission = await userPermissionRepo.deleteOne({ userId, resource });
  if (!permission) {
    throw new AppError('Permission not found', 404);
  }
  return permission;
};

export const getUserPermissionsMap = async (userId) => {
  const permissions = await userPermissionRepo.findByUserId(userId);
  
  // Convert to map for easy lookup
  const permissionMap = {};
  permissions.forEach(perm => {
    permissionMap[perm.resource] = perm.actions;
  });
  
  return permissionMap;
};

/**
 * Resolve user by identifier (email, nickname, or user ID)
 * @param {string} identifier - Can be email, nickname, or user ID
 * @returns {Object} User object
 */
const resolveUserByIdentifier = async (identifier) => {
  const user = await userRepo.findByIdentifier(identifier);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

/**
 * Get user permissions by identifier (email, nickname, or user ID)
 * @param {string} identifier - Can be email, nickname, or user ID
 * @returns {Array} User permissions
 */
export const getUserPermissionsByIdentifier = async (identifier) => {
  const user = await resolveUserByIdentifier(identifier);
  return await userPermissionRepo.findByUserId(user._id);
};

/**
 * Update user permission by identifier (email, nickname, or user ID)
 * @param {string} identifier - Can be email, nickname, or user ID
 * @param {string} resource - Resource name
 * @param {Array} actions - Array of allowed actions
 * @returns {Object} Updated permission
 */
export const updateUserPermissionByIdentifier = async (identifier, resource, actions) => {
  const user = await resolveUserByIdentifier(identifier);
  return await updateUserPermission(user._id, resource, actions);
};

/**
 * Delete user permission by identifier (email, nickname, or user ID)
 * @param {string} identifier - Can be email, nickname, or user ID
 * @param {string} resource - Resource name
 * @returns {Object} Deleted permission
 */
export const deleteUserPermissionByIdentifier = async (identifier, resource) => {
  const user = await resolveUserByIdentifier(identifier);
  return await deleteUserPermission(user._id, resource);
};

// Keep old methods for backward compatibility (deprecated)
export const getUserPermissionsByEmail = async (email) => {
  return await getUserPermissionsByIdentifier(email);
};

export const updateUserPermissionByEmail = async (email, resource, actions) => {
  return await updateUserPermissionByIdentifier(email, resource, actions);
};

