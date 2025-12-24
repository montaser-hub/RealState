import express from 'express';
import * as propertyController from './property.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as propertySchema from './property.validation.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.isAuth);


router
  .route('/')
  .get(propertyController.getProperties)
  .post(
    validation(propertySchema.createPropertySchema),
    propertyController.createProperty
  );

router
  .route('/:id')
  .get(propertyController.getProperty)
  .patch(
    validation(propertySchema.updatePropertySchema),
    propertyController.updateProperty
  )
  .delete(propertyController.deleteProperty);

router.delete('/status/:id', propertyController.propertyStatus);

export default router;