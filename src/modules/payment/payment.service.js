import * as paymentRepo from './payment.repository.js';
import * as paymentHistoryRepo from './paymentHistory.repository.js';
import AppError from '../../utils/appError.js';
import { getAllDocuments } from '../../utils/queryUtil.js';

export const createPayment = async (data, userId = null, userName = null) => {
  const payment = await paymentRepo.create(data);
  
  // Create initial history record
  if (payment.status) {
    await paymentHistoryRepo.create({
      paymentId: payment._id,
      previousStatus: 'UNPAID',
      newStatus: payment.status,
      changedBy: userId,
      changedByName: userName,
    });
  }
  
  return payment;
};

export const getPayment = async (id) => {
  const payment = await paymentRepo.findById(id);
  if (!payment) throw new AppError('Payment not found', 404);
  
  // Populate history
  const history = await paymentHistoryRepo.findByPaymentId(id);
  payment.history = history;
  
  return payment;
};

export const getPayments = async (queryParams) => {
  const searchableFields = ['username', 'userEmail', 'ownerName', 'description', 'notes'];
  return await getAllDocuments(paymentRepo, queryParams, searchableFields);
};

export const updatePayment = async (id, data, userId = null, userName = null) => {
  const oldPayment = await paymentRepo.findById(id);
  if (!oldPayment) throw new AppError('Payment not found', 404);
  
  const updatedPayment = await paymentRepo.update(id, data);
  
  // Create history record if status changed
  if (oldPayment.status !== updatedPayment.status) {
    await paymentHistoryRepo.create({
      paymentId: id,
      previousStatus: oldPayment.status,
      newStatus: updatedPayment.status,
      changedBy: userId,
      changedByName: userName,
    });
  }
  
  return updatedPayment;
};

export const deletePayment = async (id) => {
  const payment = await paymentRepo.deleteOne(id);
  if (!payment) throw new AppError('Payment not found', 404);
  
  // Delete associated history
  await paymentHistoryRepo.deleteByPaymentId(id);
  
  return payment;
};

export const getPaymentHistory = async (paymentId) => {
  const payment = await paymentRepo.findById(paymentId);
  if (!payment) throw new AppError('Payment not found', 404);
  
  const history = await paymentHistoryRepo.findByPaymentId(paymentId);
  return history;
};

export const getPaymentsForPDF = async (filters = {}) => {
  let query = paymentRepo.findAll();
  
  // Apply filters if needed
  if (filters.status) {
    query = query.where({ status: filters.status });
  }
  if (filters.paymentMethod) {
    query = query.where({ paymentMethod: filters.paymentMethod });
  }
  
  const payments = await query.sort({ paymentDate: -1 }).exec();
  
  // Populate history for each payment
  const paymentsWithHistory = await Promise.all(
    payments.map(async (payment) => {
      const history = await paymentHistoryRepo.findByPaymentId(payment._id);
      return {
        ...payment.toObject(),
        history,
      };
    })
  );
  
  return paymentsWithHistory;
};

