import catchAsync from '../../middlewares/ctachAsync.js';
import * as paymentService from './payment.service.js';
import { generatePaymentsReportPDF } from '../../utils/pdfGenerator.js';

export const createPayment = catchAsync(async (req, res, next) => {
  const userId = req.user?._id || req.user?.id;
  const userName = req.user ? `${req.user.firstName} ${req.user.lastName}` : null;
  const payment = await paymentService.createPayment(req.body, userId, userName);
  
  res.status(201).json({
    status: 'success',
    data: { payment },
  });
});

export const getPayment = catchAsync(async (req, res, next) => {
  const payment = await paymentService.getPayment(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: { payment },
  });
});

export const getPayments = catchAsync(async (req, res, next) => {
  const result = await paymentService.getPayments(req.query);
  
  res.status(200).json({
    status: 'success',
    results: result.data.length,
    total: result.total,
    totalFiltered: result.totalFiltered,
    data: { payments: result.data },
  });
});

export const updatePayment = catchAsync(async (req, res, next) => {
  const userId = req.user?._id || req.user?.id;
  const userName = req.user ? `${req.user.firstName} ${req.user.lastName}` : null;
  const payment = await paymentService.updatePayment(req.params.id, req.body, userId, userName);
  
  res.status(200).json({
    status: 'success',
    data: { payment },
  });
});

export const deletePayment = catchAsync(async (req, res, next) => {
  await paymentService.deletePayment(req.params.id);
  
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getPaymentHistory = catchAsync(async (req, res, next) => {
  const history = await paymentService.getPaymentHistory(req.params.id);
  
  res.status(200).json({
    status: 'success',
    results: history.length,
    data: { history },
  });
});

export const exportPaymentsPDF = catchAsync(async (req, res, next) => {
  const payments = await paymentService.getPaymentsForPDF({ all: 'true' });
  const doc = generatePaymentsReportPDF(payments, {});
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=all-payments-${Date.now()}.pdf`);
  
  doc.pipe(res);
  doc.end();
});

