import express from 'express';
import * as facilityController from './facility.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as propertyFacilitySchema from './facility.validation.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.isAuth);


router
  .route('/')
  .get(facilityController.getFacilities)
  .post(
    validation(propertyFacilitySchema.createFacilitySchema),
    facilityController.createFacility
  );

router
  .route('/:id')
  .get(facilityController.getFacility)
  .patch(
    validation(propertyFacilitySchema.updateFacilitySchema),
    facilityController.updateFacility
  )
  .delete(facilityController.deleteFacility);


export default router;