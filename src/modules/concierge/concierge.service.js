import * as conciergeRepo from './concierge.repository.js';
import AppError from '../../utils/appError.js';
import { getAllDocuments } from '../../utils/queryUtil.js';
import { convertToCSV, parseCSV } from '../../utils/csvUtil.js';

export const createConcierge = async (data) => {
  // Check for email uniqueness if provided
  if (data.email) {
    const existing = await conciergeRepo.findOne({ email: data.email });
    if (existing.length > 0) {
      throw new AppError('Concierge with this email already exists', 400);
    }
  }

  return await conciergeRepo.create(data);
};

export const getConcierge = async (id) => {
  const concierge = await conciergeRepo.findById(id);
  if (!concierge) throw new AppError('Concierge not found', 404);
  return concierge;
};

export const getConcierges = async (queryParams) => {
  const searchableFields = ['firstName', 'lastName', 'email', 'contactNumber', 'alternativePhone', 'status'];
  return await getAllDocuments(conciergeRepo, queryParams, searchableFields);
};

export const updateConcierge = async (id, data) => {
  // Check for email uniqueness if email is being updated
  if (data.email) {
    const existing = await conciergeRepo.findOne({ 
      email: data.email,
      _id: { $ne: id }
    });
    if (existing.length > 0) {
      throw new AppError('Concierge with this email already exists', 400);
    }
  }

  const concierge = await conciergeRepo.update(id, data);
  if (!concierge) throw new AppError('Concierge not found', 404);
  return concierge;
};

export const deleteConcierge = async (id) => {
  const concierge = await conciergeRepo.deleteOne(id);
  if (!concierge) throw new AppError('Concierge not found', 404);
  return concierge;
};

export const exportConcierges = async (queryParams) => {
  const { data } = await getConcierges({ ...queryParams, all: 'true' });
  
  const headers = ['firstName', 'lastName', 'email', 'contactNumber', 'alternativePhone', 'dateOfBirth', 'status', 'notes'];
  const csvData = data.map(concierge => ({
    firstName: concierge.firstName || '',
    lastName: concierge.lastName || '',
    email: concierge.email || '',
    contactNumber: concierge.contactNumber || '',
    alternativePhone: concierge.alternativePhone || '',
    dateOfBirth: concierge.dateOfBirth ? new Date(concierge.dateOfBirth).toISOString().split('T')[0] : '',
    status: concierge.status || '',
    notes: concierge.notes || ''
  }));

  return convertToCSV(csvData, headers);
};

export const importConcierges = async (csvText) => {
  const data = parseCSV(csvText);
  if (data.length === 0) {
    throw new AppError('No data found in CSV file', 400);
  }

  const results = {
    success: [],
    errors: []
  };

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNumber = i + 2;

    try {
      if (!row.firstName || !row.lastName) {
        results.errors.push({
          row: rowNumber,
          error: 'Missing required fields: firstName and lastName are required'
        });
        continue;
      }

      const conciergeData = {
        firstName: row.firstName.trim(),
        lastName: row.lastName.trim(),
        email: row.email ? row.email.trim() : null,
        contactNumber: row.contactNumber ? row.contactNumber.trim() : null,
        alternativePhone: row.alternativePhone ? row.alternativePhone.trim() : null,
        dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : null,
        status: row.status && ['active', 'inactive', 'deleted'].includes(row.status.toLowerCase()) 
          ? row.status.toLowerCase() 
          : 'active',
        notes: row.notes ? row.notes.trim() : null
      };

      if (conciergeData.email) {
        const existing = await conciergeRepo.findOne({ email: conciergeData.email });
        if (existing.length > 0) {
          results.errors.push({
            row: rowNumber,
            error: `Email ${conciergeData.email} already exists`
          });
          continue;
        }
      }

      const concierge = await conciergeRepo.create(conciergeData);
      results.success.push({
        row: rowNumber,
        id: concierge._id,
        name: `${concierge.firstName} ${concierge.lastName}`
      });
    } catch (error) {
      results.errors.push({
        row: rowNumber,
        error: error.message || 'Unknown error'
      });
    }
  }

  return results;
};

