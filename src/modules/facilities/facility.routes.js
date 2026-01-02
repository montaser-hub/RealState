import express from 'express';
import * as facilityController from './facility.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as propertyFacilitySchema from './facility.validation.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.isAuth);

router
  .route('/')
  .get(authorize('facilities', 'read'), facilityController.getFacilities)
  .post(
    authorize('facilities', 'create'),
    validation(propertyFacilitySchema.createFacilitySchema),
    facilityController.createFacility
  );

router
  .route('/:id')
  .get(authorize('facilities', 'read'), facilityController.getFacility)
  .patch(
    authorize('facilities', 'update'),
    validation(propertyFacilitySchema.updateFacilitySchema),
    facilityController.updateFacility
  )
  .delete(authorize('facilities', 'delete'), facilityController.deleteFacility);


export default router;