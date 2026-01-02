import express from 'express';
import * as propertyController from './property.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as propertySchema from './property.validation.js';
import { authorize } from '../../middlewares/authorize.js';
import propertyMediaRouter from '../media/propertyMedia.routes.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.isAuth);

router
  .route('/')
  .get(authorize('properties', 'read'), propertyController.getProperties)
  .post(
    authorize('properties', 'create'),
    validation(propertySchema.createPropertySchema),
    propertyController.createProperty
  );

router
  .route('/:id')
  .get(authorize('properties', 'read'), propertyController.getProperty)
  .patch(
    authorize('properties', 'update'),
    validation(propertySchema.updatePropertySchema),
    propertyController.updateProperty
  )
  .delete(authorize('properties', 'delete'), propertyController.deleteProperty);

router.delete('/status/:id', authorize('properties', 'update'), propertyController.propertyStatus);

// Property media routes (nested)
router.use('/:propertyId/media', propertyMediaRouter);

export default router;