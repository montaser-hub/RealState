import * as paymentService from './payment.service.js';
import catchAsync from '../../middlewares/ctachAsync.js';

/**
 * Create a new payment
 * POST /api/v1/payments
 */
export const createPayment = catchAsync(async (req, res, next) => {
  const data = req.body;
  const currentUser = req.user; // From isAuth middleware

  const payment = await paymentService.createPayment(data, currentUser);

  res.status(201).json({
    message: 'Payment created successfully',
    data: payment,
  });
});

/**
 * Get a payment by ID
 * GET /api/v1/payments/:id
 */
export const getPayment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const payment = await paymentService.getPayment(id);

  res.status(200).json({
    message: 'Payment fetched successfully',
    data: payment,
  });
});

/**
 * Get all payments with filtering
 * GET /api/v1/payments
 */
export const getPayments = catchAsync(async (req, res, next) => {
  const query = { ...req.query };

  const { data, total, totalFiltered } = await paymentService.getPayments(query);

  res.status(200).json({
    message: 'Payments fetched successfully',
    total,
    totalFiltered,
    limit: query.limit,
    page: query.page,
    data,
  });
});

/**
 * Update a payment
 * PATCH /api/v1/payments/:id
 */
export const updatePayment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const currentUser = req.user; // From isAuth middleware

  const payment = await paymentService.updatePayment(id, data, currentUser);

  res.status(200).json({
    message: 'Payment updated successfully',
    data: payment,
  });
});

/**
 * Delete a payment (soft delete)
 * DELETE /api/v1/payments/:id
 */
export const deletePayment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await paymentService.deletePayment(id);

  res.status(200).json({
    message: 'Payment deleted successfully',
  });
});

/**
 * Get payment history
 * GET /api/v1/payments/:id/history
 */
export const getPaymentHistory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const history = await paymentService.getPaymentHistory(id);

  res.status(200).json({
    message: 'Payment history fetched successfully',
    data: history,
  });
});

