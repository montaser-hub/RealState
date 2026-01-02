import AppError from '../utils/appError.js';
import * as rolePermissionService from '../modules/rolePermission/rolePermission.service.js';
import * as userPermissionService from '../modules/userPermission/userPermission.service.js';

export const authorize = (resource, action) => {
  return async (req, res, next) => {
    // Admin bypasses all permission checks
    if (req.user?.role === 'admin') {
      return next();
    }

    // Get user ID and role
    const userId = req.user?._id || req.user?.id;
    const userRole = req.user?.role;
    
    if (!userRole) {
      return next(new AppError('User role not found', 403));
    }

    try {
      let resourcePermissions = [];

      // 1. Check user-specific permissions first (overrides role permissions)
      if (userId) {
        const userPermissions = await userPermissionService.getUserPermissionsMap(userId);
        if (userPermissions[resource]) {
          resourcePermissions = userPermissions[resource];
        }
      }

      // 2. If no user-specific permission, fall back to role permissions
      if (resourcePermissions.length === 0) {
        const rolePermissions = await rolePermissionService.getUserPermissions(userRole);
        resourcePermissions = rolePermissions[resource] || [];
      }

      // 3. Check if user has the required action
      if (!resourcePermissions.includes(action)) {
        return next(
          new AppError(
            `You do not have permission to ${action} ${resource}`,
            403
          )
        );
      }

      next();
    } catch (error) {
      return next(new AppError('Error checking permissions', 500));
    }
  };
};

