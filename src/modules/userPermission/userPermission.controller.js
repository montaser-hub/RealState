import * as userPermissionService from './userPermission.service.js';
import catchAsync from '../../middlewares/ctachAsync.js';

/**
 * Create user permission (requires userId in body)
 */
export const createUserPermission = catchAsync(async (req, res) => {
  const permission = await userPermissionService.createUserPermission(req.body);
  res.status(201).json({
    message: 'User permission created',
    data: permission
  });
});

/**
 * Get user permissions by identifier (email, nickname, or user ID)
 */
export const getUserPermissionsByIdentifier = catchAsync(async (req, res) => {
  const { identifier } = req.params;
  const permissions = await userPermissionService.getUserPermissionsByIdentifier(identifier);
  res.status(200).json({
    message: 'User permissions fetched',
    data: permissions
  });
});

/**
 * Get all user permissions
 */
export const getAllUserPermissions = catchAsync(async (req, res) => {
  const permissions = await userPermissionService.getAllUserPermissions();
  res.status(200).json({
    message: 'All user permissions fetched',
    data: permissions
  });
});

/**
 * Update user permission by identifier (email, nickname, or user ID)
 */
export const updateUserPermissionByIdentifier = catchAsync(async (req, res) => {
  const { identifier, resource } = req.params;
  const permission = await userPermissionService.updateUserPermissionByIdentifier(
    identifier,
    resource,
    req.body.actions
  );
  res.status(200).json({
    message: 'User permission updated',
    data: permission
  });
});

/**
 * Delete user permission by identifier (email, nickname, or user ID)
 */
export const deleteUserPermissionByIdentifier = catchAsync(async (req, res) => {
  const { identifier, resource } = req.params;
  await userPermissionService.deleteUserPermissionByIdentifier(identifier, resource);
  res.status(200).json({
    message: 'User permission deleted'
  });
});

