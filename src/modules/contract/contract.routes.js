import express from 'express';
import * as contracrtController from './contract.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as propertycontractSchema from './contract.validation.js';

const router = express.Router();

// Protect all routes after this middleware
// router.use(authController.isAuth);


router
  .route('/')
  .get(contracrtController.getContracts)
  .post(
    validation(propertycontractSchema.createContractSchema),
    contracrtController.createContract
  );

router
  .route('/:id')
  .get(contracrtController.getContract)
  .patch(
    validation(propertycontractSchema.updateContractSchema),
    contracrtController.updateContract
  )
  .delete(contracrtController.deleteContract);

router
  .route('/status/:id')
  .patch(contracrtController.updateContractStatus);

export default router;