import express from 'express';
import * as contracrtController from './contract.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as propertycontractSchema from './contract.validation.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.isAuth);

router
  .route('/')
  .get(authorize('contracts', 'read'), contracrtController.getContracts)
  .post(
    authorize('contracts', 'create'),
    validation(propertycontractSchema.createContractSchema),
    contracrtController.createContract
  );

router
  .route('/:id')
  .get(authorize('contracts', 'read'), contracrtController.getContract)
  .patch(
    authorize('contracts', 'update'),
    validation(propertycontractSchema.updateContractSchema),
    contracrtController.updateContract
  )
  .delete(authorize('contracts', 'delete'), contracrtController.deleteContract);

router
  .route('/status/:id')
  .patch(authorize('contracts', 'update'), contracrtController.updateContractStatus);

export default router;