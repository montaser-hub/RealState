import express from 'express';
import * as conciergeController from './concierge.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as conciergeSchema from './concierge.validation.js';
import { authorize } from '../../middlewares/authorize.js';
import { uploadSingle } from '../../utils/multer.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.isAuth);

router
  .route('/')
  .get(authorize('concierges', 'read'), conciergeController.getConcierges)
  .post(
    authorize('concierges', 'create'),
    conciergeController.uploadConciergePhoto,
    validation(conciergeSchema.createConciergeSchema),
    conciergeController.resizeConciergePhoto,
    conciergeController.createConcierge
  );

router
  .route('/:id')
  .get(authorize('concierges', 'read'), conciergeController.getConcierge)
  .patch(
    authorize('concierges', 'update'),
    conciergeController.uploadConciergePhoto,
    validation(conciergeSchema.updateConciergeSchema),
    conciergeController.resizeConciergePhoto,
    conciergeController.updateConcierge
  )
  .delete(authorize('concierges', 'delete'), conciergeController.deleteConcierge);

const uploadCSV = uploadSingle('file', 'file');

router
  .route('/export')
  .get(authorize('concierges', 'read'), conciergeController.exportConcierges);

router
  .route('/import')
  .post(
    authorize('concierges', 'create'),
    uploadCSV,
    conciergeController.importConcierges
  );

export default router;

