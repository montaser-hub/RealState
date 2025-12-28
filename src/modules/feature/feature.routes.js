import express from 'express';
import * as featureController from './feature.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as propertyFeatureSchema from './feature.validation.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.isAuth);


router
  .route('/')
  .get(featureController.getFeatures)
  .post(
    validation(propertyFeatureSchema.createFeatureSchema),
    featureController.createFeature
  );

router
  .route('/:id')
  .get(featureController.getFeature)
  .patch(
    validation(propertyFeatureSchema.updateFeatureSchema),
    featureController.updateFeature
  )
  .delete(featureController.deleteFeature);


export default router;