import * as ownerRepo from './owner.repository.js';
import AppError from '../../utils/appError.js';
import { getAllDocuments } from '../../utils/queryUtil.js';
import { convertToCSV, parseCSV } from '../../utils/csvUtil.js';

export const createOwner = async (data) => {
  // Check for email uniqueness if provided
  if (data.email) {
    const existing = await ownerRepo.findOne({ email: data.email });
    if (existing.length > 0) {
      throw new AppError('Owner with this email already exists', 400);
    }
  }

  return await ownerRepo.create(data);
};

export const getOwner = async (id) => {
  const owner = await ownerRepo.findById(id);
  if (!owner) throw new AppError('Owner not found', 404);
  return owner;
};

export const getOwners = async (queryParams) => {
  const searchableFields = ['firstName', 'lastName', 'email', 'contactNumber', 'alternativePhone', 'status'];
  return await getAllDocuments(ownerRepo, queryParams, searchableFields);
};

export const updateOwner = async (id, data) => {
  // Check for email uniqueness if email is being updated
  if (data.email) {
    const existing = await ownerRepo.findOne({ 
      email: data.email,
      _id: { $ne: id }
    });
    if (existing.length > 0) {
      throw new AppError('Owner with this email already exists', 400);
    }
  }

  const owner = await ownerRepo.update(id, data);
  if (!owner) throw new AppError('Owner not found', 404);
  return owner;
};

export const deleteOwner = async (id) => {
  const owner = await ownerRepo.deleteOne(id);
  if (!owner) throw new AppError('Owner not found', 404);
  return owner;
};

export const exportOwners = async (queryParams) => {
  const { data } = await getOwners({ ...queryParams, all: 'true' });
  
  const headers = ['firstName', 'lastName', 'email', 'contactNumber', 'alternativePhone', 'dateOfBirth', 'status', 'notes'];
  const csvData = data.map(owner => ({
    firstName: owner.firstName || '',
    lastName: owner.lastName || '',
    email: owner.email || '',
    contactNumber: owner.contactNumber || '',
    alternativePhone: owner.alternativePhone || '',
    dateOfBirth: owner.dateOfBirth ? new Date(owner.dateOfBirth).toISOString().split('T')[0] : '',
    status: owner.status || '',
    notes: owner.notes || ''
  }));

  return convertToCSV(csvData, headers);
};

export const importOwners = async (csvText) => {
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
    const rowNumber = i + 2; // +2 because row 1 is header, and arrays are 0-indexed

    try {
      // Validate required fields
      if (!row.firstName || !row.lastName) {
        results.errors.push({
          row: rowNumber,
          error: 'Missing required fields: firstName and lastName are required'
        });
        continue;
      }

      // Prepare owner data
      const ownerData = {
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

      // Check for duplicate email if provided
      if (ownerData.email) {
        const existing = await ownerRepo.findOne({ email: ownerData.email });
        if (existing.length > 0) {
          results.errors.push({
            row: rowNumber,
            error: `Email ${ownerData.email} already exists`
          });
          continue;
        }
      }

      const owner = await ownerRepo.create(ownerData);
      results.success.push({
        row: rowNumber,
        id: owner._id,
        name: `${owner.firstName} ${owner.lastName}`
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

