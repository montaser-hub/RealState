import * as rolePermissionService from './rolePermission.service.js';
import catchAsync from '../../middlewares/ctachAsync.js';

export const createRolePermission = catchAsync(async (req, res) => {
  const permission = await rolePermissionService.createRolePermission(req.body);
  res.status(201).json({
    message: 'Role permission created',
    data: permission
  });
});

export const getRolePermissions = catchAsync(async (req, res) => {
  const { role } = req.params;
  const permissions = await rolePermissionService.getRolePermissions(role);
  res.status(200).json({
    message: 'Role permissions fetched',
    data: permissions
  });
});

export const getAllRolePermissions = catchAsync(async (req, res) => {
  const permissions = await rolePermissionService.getAllRolePermissions();
  res.status(200).json({
    message: 'All role permissions fetched',
    data: permissions
  });
});

export const updateRolePermission = catchAsync(async (req, res) => {
  const { role, resource } = req.params;
  const permission = await rolePermissionService.updateRolePermission(
    role,
    resource,
    req.body.actions
  );
  res.status(200).json({
    message: 'Role permission updated',
    data: permission
  });
});

export const deleteRolePermission = catchAsync(async (req, res) => {
  const { role, resource } = req.params;
  await rolePermissionService.deleteRolePermission(role, resource);
  res.status(200).json({
    message: 'Role permission deleted'
  });
});








