import { AbilityBuilder, Ability } from '@casl/ability';
import * as rolePermissionService from '../modules/rolePermission/rolePermission.service.js';
import * as userPermissionService from '../modules/userPermission/userPermission.service.js';
import AppError from './appError.js';

/**
 * Define CASL actions and subjects
 */
export const Actions = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
};

export const Subjects = {
  PROPERTIES: 'properties',
  CONTRACTS: 'contracts',
  USERS: 'users',
  PAYMENTS: 'payments',
  FEATURES: 'features',
  FACILITIES: 'facilities',
  MEDIA: 'media',
  REMINDERS: 'reminders',
};

/**
 * Map CASL actions to our action strings
 */
const actionMap = {
  read: 'read',
  create: 'create',
  update: 'update',
  delete: 'delete',
};

/**
 * Build CASL ability for a user based on their role and user-specific permissions
 * @param {Object} user - User object with _id and role
 * @returns {Promise<Ability>} CASL Ability instance
 */
export const defineAbilityFor = async (user) => {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  // Admin has all permissions
  if (user.role === 'admin') {
    can('manage', 'all'); // 'manage' is a special CASL action that means "all actions"
    return build();
  }

  const userId = user._id || user.id;
  const userRole = user.role;

  if (!userRole) {
    return build(); // Return empty ability if no role
  }

  try {
    // 1. Get user-specific permissions (overrides role permissions)
    let userPermissionsMap = {};
    if (userId) {
      // Ensure userId is properly formatted (Mongoose handles string/ObjectId conversion)
      userPermissionsMap = await userPermissionService.getUserPermissionsMap(userId);
    }

    // 2. Get role-based permissions
    const rolePermissionsMap = await rolePermissionService.getUserPermissions(userRole);

    // 3. Merge permissions: user-specific overrides role permissions
    const finalPermissionsMap = { ...rolePermissionsMap, ...userPermissionsMap };

    // 4. Build CASL rules from permissions
    Object.keys(finalPermissionsMap).forEach((resource) => {
      const actions = finalPermissionsMap[resource] || [];
      
      actions.forEach((action) => {
        const caslAction = actionMap[action];
        if (caslAction) {
          can(caslAction, resource);
        }
      });
    });

    return build();
  } catch (error) {
    console.error('Error building ability:', error);
    return build(); // Return empty ability on error
  }
};

/**
 * Check if user can perform action on resource
 * @param {Ability} ability - CASL Ability instance
 * @param {string} action - Action to check (read, create, update, delete)
 * @param {string} resource - Resource name (properties, contracts, etc.)
 * @returns {boolean} True if user can perform the action
 */
export const canPerformAction = (ability, action, resource) => {
  const caslAction = actionMap[action];
  if (!caslAction) {
    return false;
  }
  return ability.can(caslAction, resource);
};

/**
 * Helper function to check permissions in controllers
 * Usage: if (!can(req.ability, 'update', 'properties')) { throw new AppError(...) }
 * @param {Ability} ability - CASL Ability instance (from req.ability)
 * @param {string} action - Action to check
 * @param {string} resource - Resource name
 * @returns {boolean} True if allowed
 */
export const can = (ability, action, resource) => {
  if (!ability) {
    return false;
  }
  return canPerformAction(ability, action, resource);
};

/**
 * Helper function to throw error if user cannot perform action
 * Usage: throwIfCannot(req.ability, 'delete', 'users', 'You cannot delete users');
 * @param {Ability} ability - CASL Ability instance
 * @param {string} action - Action to check
 * @param {string} resource - Resource name
 * @param {string} message - Custom error message
 * @throws {AppError} If user cannot perform the action
 */
export const throwIfCannot = (ability, action, resource, message = null) => {
  if (!canPerformAction(ability, action, resource)) {
    const errorMessage = message || `You do not have permission to ${action} ${resource}`;
    throw new AppError(errorMessage, 403);
  }
};

