import express from 'express';
import * as paymentController from './payment.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as paymentSchema from './payment.validation.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

// Protect all routes
router.use(authController.isAuth);

// Apply authorization middleware
router.use(authorize('payments', 'read'));

// Routes
router
  .route('/')
  .get(paymentController.getPayments)
  .post(
    authorize('payments', 'create'),
    validation(paymentSchema.createPaymentSchema),
    paymentController.createPayment
  );

// PDF Export (must be before /:id route)
router.get('/export/pdf', authorize('payments', 'read'), paymentController.exportPaymentsPDF);

// Payment History (must be before /:id route)
router.get('/:id/history', paymentController.getPaymentHistory);

router
  .route('/:id')
  .get(paymentController.getPayment)
  .patch(
    authorize('payments', 'update'),
    validation(paymentSchema.updatePaymentSchema),
    paymentController.updatePayment
  )
  .delete(
    authorize('payments', 'delete'),
    paymentController.deletePayment
  );

export default router;

