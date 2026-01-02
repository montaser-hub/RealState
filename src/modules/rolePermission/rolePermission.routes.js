import express from 'express';
import * as rolePermissionController from './rolePermission.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as rolePermissionSchema from './rolePermission.validation.js';

const router = express.Router();

// All routes require authentication (admin bypasses authorize check)
router.use(authController.isAuth);

router
  .route('/')
  .get(rolePermissionController.getAllRolePermissions)
  .post(
    validation(rolePermissionSchema.createRolePermissionSchema),
    rolePermissionController.createRolePermission
  );

router
  .route('/role/:role')
  .get(rolePermissionController.getRolePermissions);

router
  .route('/:role/:resource')
  .patch(
    validation(rolePermissionSchema.updateRolePermissionSchema),
    rolePermissionController.updateRolePermission
  )
  .delete(rolePermissionController.deleteRolePermission);

export default router;

