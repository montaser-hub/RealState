import * as paymentRepo from './payment.repository.js';
import AppError from '../../utils/appError.js';
import { getAllDocuments } from '../../utils/queryUtil.js';

/**
 * Track changes to payment fields
 * @param {Object} oldPayment - Old payment data
 * @param {Object} newPayment - New payment data
 * @param {string} userId - User ID who made the change
 * @param {string} userName - User name who made the change
 * @returns {Array} Array of change objects
 */
const trackChanges = (oldPayment, newPayment, userId = null, userName = null) => {
  const changes = [];
  const fieldsToTrack = ['status', 'paidAmount', 'totalAmount', 'paymentMethod', 'notes', 'description', 'paymentDate'];

  fieldsToTrack.forEach(field => {
    const oldValue = oldPayment?.[field];
    const newValue = newPayment[field];

    // Check if value actually changed
    if (oldValue !== undefined && oldValue !== newValue) {
      // Handle date comparison
      if (field === 'paymentDate') {
        const oldDate = oldValue instanceof Date ? oldValue.getTime() : new Date(oldValue).getTime();
        const newDate = newValue instanceof Date ? newValue.getTime() : new Date(newValue).getTime();
        if (oldDate === newDate) return;
      }

      changes.push({
        field,
        oldValue: oldValue !== null && oldValue !== undefined ? oldValue : null,
        newValue: newValue !== null && newValue !== undefined ? newValue : null,
        changedBy: userId,
        changedByName: userName,
        changedAt: new Date(),
      });
    }
  });

  return changes;
};

export const createPayment = async (data, userId = null, userName = null) => {
  // Create payment with initial change record
  const payment = await paymentRepo.create(data);
  
  // Add initial creation change
  if (payment.status) {
    payment.changes = [{
      field: 'status',
      oldValue: null,
      newValue: payment.status,
      changedBy: userId,
      changedByName: userName,
      changedAt: new Date(),
      notes: 'Payment created',
    }];
    await payment.save();
  }
  
  return payment;
};

export const getPayment = async (id) => {
  const payment = await paymentRepo.findById(id);
  if (!payment) throw new AppError('Payment not found', 404);
  
  // Changes are already in the payment document
  // Sort changes by date (newest first)
  if (payment.changes && payment.changes.length > 0) {
    payment.changes.sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));
  }
  
  return payment;
};

export const getPayments = async (queryParams) => {
  const searchableFields = ['username', 'userEmail', 'ownerName', 'description', 'notes'];
  return await getAllDocuments(paymentRepo, queryParams, searchableFields);
};

export const updatePayment = async (id, data, userId = null, userName = null) => {
  const oldPayment = await paymentRepo.findById(id);
  if (!oldPayment) throw new AppError('Payment not found', 404);
  
  // Track changes before updating
  const changes = trackChanges(oldPayment, { ...oldPayment.toObject(), ...data }, userId, userName);
  
  // Update payment
  const updatedPayment = await paymentRepo.update(id, data);
  
  // Add changes to payment if any were detected
  if (changes.length > 0) {
    // Get existing changes array
    const existingChanges = updatedPayment.changes || [];
    
    // Add new changes to the beginning (most recent first)
    updatedPayment.changes = [...changes, ...existingChanges];
    
    // Limit to last 50 changes to prevent document bloat
    if (updatedPayment.changes.length > 50) {
      updatedPayment.changes = updatedPayment.changes.slice(0, 50);
    }
    
    await updatedPayment.save();
  }
  
  return updatedPayment;
};

export const deletePayment = async (id) => {
  const payment = await paymentRepo.deleteOne(id);
  if (!payment) throw new AppError('Payment not found', 404);
  
  // Changes are deleted automatically with the payment document
  return payment;
};

export const getPaymentHistory = async (paymentId) => {
  const payment = await paymentRepo.findById(paymentId);
  if (!payment) throw new AppError('Payment not found', 404);
  
  // Return changes array sorted by date (newest first)
  const changes = payment.changes || [];
  return changes.sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));
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
  
  // Changes are already included in payment documents
  return payments.map(payment => payment.toObject());
};

