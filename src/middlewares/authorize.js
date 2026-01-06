import AppError from '../utils/appError.js';
import { defineAbilityFor, canPerformAction } from '../utils/ability.js';

/**
 * CASL-based authorization middleware
 * @param {string} resource - Resource name (e.g., 'properties', 'contracts')
 * @param {string} action - Action name (e.g., 'read', 'create', 'update', 'delete')
 * @returns {Function} Express middleware function
 */
export const authorize = (resource, action) => {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      // Build CASL ability for the user
      const ability = await defineAbilityFor(req.user);

      // Check if user can perform the action on the resource
      if (!canPerformAction(ability, action, resource)) {
        return next(
          new AppError(
            `You do not have permission to ${action} ${resource}`,
            403
          )
        );
      }

      // Attach ability to request for potential use in controllers
      req.ability = ability;

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return next(new AppError('Error checking permissions', 500));
    }
  };
};

