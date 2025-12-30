import * as paymentRepo from './payment.repository.js';
import * as paymentHistoryRepo from './paymentHistory.repository.js';
import * as userRepo from '../user/user.repository.js';
import * as propertyRepo from '../property/property.repository.js';
import AppError from '../../utils/appError.js';
import { getAllDocuments } from '../../utils/queryUtil.js';

/**
 * Try to find and link user based on ownership identifiers
 */
const linkUser = async (data) => {
  let user = null;
  
  if (data.userEmail) {
    user = await userRepo.findOne(data.userEmail, null);
  } else if (data.username) {
    user = await userRepo.findOne(null, data.username);
  }
  
  return user;
};

/**
 * Create a payment history record for status changes
 */
const createStatusHistory = async (payment, previousStatus, newStatus, changedBy, reason, notes) => {
  if (previousStatus === newStatus) {
    return null; // No history needed if status didn't change
  }

  const historyData = {
    payment: payment._id,
    previousStatus,
    newStatus,
    changeDate: new Date(),
    changedBy: changedBy?._id || null,
    changedByName: changedBy ? `${changedBy.firstName} ${changedBy.lastName}` : 'System',
    reason,
    notes,
    totalAmount: payment.totalAmount,
    paidAmount: payment.paidAmount,
    unpaidAmount: payment.unpaidAmount,
  };

  return await paymentHistoryRepo.create(historyData);
};

/**
 * Create a new payment
 */
export const createPayment = async (data, currentUser = null) => {
  // Validate business rules
  if (data.paidAmount > data.totalAmount) {
    throw new AppError('Paid amount cannot exceed total amount', 400);
  }

  // Try to link user if identifiers provided
  const user = await linkUser(data);
  if (user) {
    data.user = user._id;
  }

  // If apartment reference provided, validate it exists
  if (data.apartmentReference) {
    const apartment = await propertyRepo.findById(data.apartmentReference);
    if (!apartment) {
      throw new AppError('Apartment not found', 404);
    }
    data.assignedType = 'ASSIGNED';
  }

  // Calculate unpaid amount
  data.unpaidAmount = Math.max(0, data.totalAmount - (data.paidAmount || 0));

  // Set status based on amounts
  if (data.paidAmount >= data.totalAmount) {
    data.status = 'PAID';
  } else {
    data.status = 'UNPAID';
  }

  const payment = await paymentRepo.create(data);

  // Create initial history record if status is PAID
  if (payment.status === 'PAID') {
    await createStatusHistory(
      payment,
      'UNPAID', // Initial state
      'PAID',
      currentUser,
      'Initial payment creation',
      data.notes
    );
  }

  return await paymentRepo.findById(payment._id);
};

/**
 * Get a payment by ID
 */
export const getPayment = async (id) => {
  const payment = await paymentRepo.findById(id);
  if (!payment || payment.deletedAt) {
    throw new AppError('Payment not found', 404);
  }
  return payment;
};

/**
 * Get all payments with filtering
 */
export const getPayments = async (queryParams) => {
  const searchableFields = [
    'username',
    'userEmail',
    'ownerName',
    'status',
    'paymentMethod',
    'assignedType',
  ];

  return await getAllDocuments(paymentRepo, queryParams, searchableFields);
};

/**
 * Update a payment
 */
export const updatePayment = async (id, data, currentUser = null) => {
  const existingPayment = await paymentRepo.findById(id);
  
  if (!existingPayment || existingPayment.deletedAt) {
    throw new AppError('Payment not found', 404);
  }

  const previousStatus = existingPayment.status;

  // Validate business rules
  if (data.paidAmount !== undefined && data.totalAmount !== undefined) {
    if (data.paidAmount > data.totalAmount) {
      throw new AppError('Paid amount cannot exceed total amount', 400);
    }
  } else if (data.paidAmount !== undefined) {
    if (data.paidAmount > existingPayment.totalAmount) {
      throw new AppError('Paid amount cannot exceed total amount', 400);
    }
  } else if (data.totalAmount !== undefined) {
    if (existingPayment.paidAmount > data.totalAmount) {
      throw new AppError('Total amount cannot be less than paid amount', 400);
    }
  }

  // Try to link user if identifiers changed
  if (data.userEmail || data.username) {
    const user = await linkUser({ ...existingPayment.toObject(), ...data });
    if (user) {
      data.user = user._id;
    }
  }

  // If apartment reference provided, validate it exists
  if (data.apartmentReference) {
    const apartment = await propertyRepo.findById(data.apartmentReference);
    if (!apartment) {
      throw new AppError('Apartment not found', 404);
    }
    data.assignedType = 'ASSIGNED';
  }

  // Calculate amounts
  const totalAmount = data.totalAmount !== undefined ? data.totalAmount : existingPayment.totalAmount;
  const paidAmount = data.paidAmount !== undefined ? data.paidAmount : existingPayment.paidAmount;
  const unpaidAmount = Math.max(0, totalAmount - paidAmount);

  // Determine new status
  let newStatus = previousStatus;
  if (paidAmount >= totalAmount) {
    newStatus = 'PAID';
  } else {
    newStatus = 'UNPAID';
  }

  data.unpaidAmount = unpaidAmount;
  data.status = newStatus;

  const updatedPayment = await paymentRepo.update(id, data);

  // Create history record if status changed
  if (previousStatus !== newStatus) {
    await createStatusHistory(
      updatedPayment,
      previousStatus,
      newStatus,
      currentUser,
      data.reason || 'Payment status updated',
      data.notes
    );
  }

  return updatedPayment;
};

/**
 * Delete a payment (soft delete)
 */
export const deletePayment = async (id) => {
  const payment = await paymentRepo.findById(id);
  if (!payment || payment.deletedAt) {
    throw new AppError('Payment not found', 404);
  }

  return await paymentRepo.softDelete(id);
};

/**
 * Get payment history
 */
export const getPaymentHistory = async (paymentId) => {
  const payment = await paymentRepo.findById(paymentId);
  if (!payment || payment.deletedAt) {
    throw new AppError('Payment not found', 404);
  }

  return await paymentHistoryRepo.findByPayment(paymentId);
};

