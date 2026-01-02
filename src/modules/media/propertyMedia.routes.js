import express from 'express';
import * as propertyMediaController from './propertyMedia.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as propertyMediaSchema from './propertyMedia.validation.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router({ mergeParams: true });

// Protect all routes
router.use(authController.isAuth);

// Upload single or multiple images
router.post(
  '/',
  authorize('media', 'create'),
  propertyMediaController.uploadPropertyImages,
  propertyMediaController.processPropertyImages,
  validation(propertyMediaSchema.createPropertyMediaSchema),
  propertyMediaController.createPropertyMedia
);

// Get all media for a property
router.get('/', authorize('media', 'read'), propertyMediaController.getPropertyMediaList);

// Reorder media
router.patch(
  '/reorder',
  authorize('media', 'update'),
  validation(propertyMediaSchema.reorderPropertyMediaSchema),
  propertyMediaController.reorderPropertyMedia
);

// Set primary media
router.patch('/:id/set-primary', authorize('media', 'update'), propertyMediaController.setPrimaryMedia);

// Delete media
router.delete('/:id', authorize('media', 'delete'), propertyMediaController.deletePropertyMedia);

export default router;
