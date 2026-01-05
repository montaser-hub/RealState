import express from 'express';
import * as ownerController from './owner.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as ownerSchema from './owner.validation.js';
import { authorize } from '../../middlewares/authorize.js';
import { uploadSingle } from '../../utils/multer.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.isAuth);

router
  .route('/')
  .get(authorize('owners', 'read'), ownerController.getOwners)
  .post(
    authorize('owners', 'create'),
    ownerController.uploadOwnerPhoto,
    validation(ownerSchema.createOwnerSchema),
    ownerController.resizeOwnerPhoto,
    ownerController.createOwner
  );

router
  .route('/:id')
  .get(authorize('owners', 'read'), ownerController.getOwner)
  .patch(
    authorize('owners', 'update'),
    ownerController.uploadOwnerPhoto,
    validation(ownerSchema.updateOwnerSchema),
    ownerController.resizeOwnerPhoto,
    ownerController.updateOwner
  )
  .delete(authorize('owners', 'delete'), ownerController.deleteOwner);

router
  .route('/export')
  .get(authorize('owners', 'read'), ownerController.exportOwners);

const uploadCSV = uploadSingle('file', 'file');

router
  .route('/import')
  .post(
    authorize('owners', 'create'),
    uploadCSV,
    ownerController.importOwners
  );

export default router;

