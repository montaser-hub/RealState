import express from 'express';
import * as paymentController from './payment.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as paymentSchema from './payment.validation.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.isAuth);

// Payment routes
router
  .route('/')
  .get(paymentController.getPayments)
  .post(
    validation(paymentSchema.createPaymentSchema),
    paymentController.createPayment
  );

router
  .route('/:id')
  .get(paymentController.getPayment)
  .patch(
    validation(paymentSchema.updatePaymentSchema),
    paymentController.updatePayment
  )
  .delete(paymentController.deletePayment);

// Payment history route
router.get('/:id/history', paymentController.getPaymentHistory);

export default router;

