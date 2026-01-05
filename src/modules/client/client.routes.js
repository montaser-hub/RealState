import express from 'express';
import * as clientController from './client.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as clientSchema from './client.validation.js';
import { authorize } from '../../middlewares/authorize.js';
import { uploadSingle } from '../../utils/multer.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.isAuth);

router
  .route('/')
  .get(authorize('clients', 'read'), clientController.getClients)
  .post(
    authorize('clients', 'create'),
    clientController.uploadClientPhoto,
    validation(clientSchema.createClientSchema),
    clientController.resizeClientPhoto,
    clientController.createClient
  );

const uploadCSV = uploadSingle('file', 'file');

router
  .route('/export')
  .get(authorize('clients', 'read'), clientController.exportClients);

router
  .route('/import')
  .post(
    authorize('clients', 'create'),
    uploadCSV,
    clientController.importClients
  );

router
  .route('/:id')
  .get(authorize('clients', 'read'), clientController.getClient)
  .patch(
    authorize('clients', 'update'),
    clientController.uploadClientPhoto,
    validation(clientSchema.updateClientSchema),
    clientController.resizeClientPhoto,
    clientController.updateClient
  )
  .delete(authorize('clients', 'delete'), clientController.deleteClient);

export default router;

