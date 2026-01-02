import express from 'express';
import * as featureController from './feature.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as propertyFeatureSchema from './feature.validation.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.isAuth);

router
  .route('/')
  .get(authorize('features', 'read'), featureController.getFeatures)
  .post(
    authorize('features', 'create'),
    validation(propertyFeatureSchema.createFeatureSchema),
    featureController.createFeature
  );

router
  .route('/:id')
  .get(authorize('features', 'read'), featureController.getFeature)
  .patch(
    authorize('features', 'update'),
    validation(propertyFeatureSchema.updateFeatureSchema),
    featureController.updateFeature
  )
  .delete(authorize('features', 'delete'), featureController.deleteFeature);


export default router;