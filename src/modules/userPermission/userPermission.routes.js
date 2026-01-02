import express from 'express';
import * as userPermissionController from './userPermission.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as userPermissionSchema from './userPermission.validation.js';

const router = express.Router();

// All routes require authentication (admin bypasses authorize check)
router.use(authController.isAuth);

/**
 * Unified User Permission Routes
 * Identifier can be: email, nickname, or user ID
 * Examples:
 * - GET /api/v1/user-permissions/john@example.com
 * - GET /api/v1/user-permissions/john_doe
 * - GET /api/v1/user-permissions/507f1f77bcf86cd799439011
 */
router
  .route('/')
  .get(userPermissionController.getAllUserPermissions)
  .post(
    validation(userPermissionSchema.createUserPermissionSchema),
    userPermissionController.createUserPermission
  );

router
  .route('/:identifier')
  .get(userPermissionController.getUserPermissionsByIdentifier);

router
  .route('/:identifier/:resource')
  .patch(
    validation(userPermissionSchema.updateUserPermissionSchema),
    userPermissionController.updateUserPermissionByIdentifier
  )
  .delete(userPermissionController.deleteUserPermissionByIdentifier);

export default router;

