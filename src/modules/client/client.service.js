import * as clientRepo from './client.repository.js';
import AppError from '../../utils/appError.js';
import { getAllDocuments } from '../../utils/queryUtil.js';
import { convertToCSV, parseCSV } from '../../utils/csvUtil.js';

export const createClient = async (data) => {
  // Check for email uniqueness if provided
  if (data.email) {
    const existing = await clientRepo.findOne({ email: data.email });
    if (existing.length > 0) {
      throw new AppError('Client with this email already exists', 400);
    }
  }

  return await clientRepo.create(data);
};

export const getClient = async (id) => {
  const client = await clientRepo.findById(id);
  if (!client) throw new AppError('Client not found', 404);
  return client;
};

export const getClients = async (queryParams) => {
  const searchableFields = ['firstName', 'lastName', 'email', 'contactNumber', 'alternativePhone', 'status'];
  return await getAllDocuments(clientRepo, queryParams, searchableFields);
};

export const updateClient = async (id, data) => {
  // Check for email uniqueness if email is being updated
  if (data.email) {
    const existing = await clientRepo.findOne({ 
      email: data.email,
      _id: { $ne: id }
    });
    if (existing.length > 0) {
      throw new AppError('Client with this email already exists', 400);
    }
  }

  const client = await clientRepo.update(id, data);
  if (!client) throw new AppError('Client not found', 404);
  return client;
};

export const deleteClient = async (id) => {
  const client = await clientRepo.deleteOne(id);
  if (!client) throw new AppError('Client not found', 404);
  return client;
};

export const exportClients = async (queryParams) => {
  const { data } = await getClients({ ...queryParams, all: 'true' });
  
  // Sort alphabetically by full name (firstName + lastName) A to Z
  const sortedData = [...data].sort((a, b) => {
    const nameA = `${(a.firstName || '')} ${(a.lastName || '')}`.trim().toLowerCase();
    const nameB = `${(b.firstName || '')} ${(b.lastName || '')}`.trim().toLowerCase();
    return nameA.localeCompare(nameB);
  });
  
  const headers = ['firstName', 'lastName', 'email', 'contactNumber', 'alternativePhone', 'dateOfBirth', 'status', 'notes'];
  const csvData = sortedData.map(client => ({
    firstName: client.firstName || '',
    lastName: client.lastName || '',
    email: client.email || '',
    contactNumber: client.contactNumber || '',
    alternativePhone: client.alternativePhone || '',
    dateOfBirth: client.dateOfBirth ? new Date(client.dateOfBirth).toISOString().split('T')[0] : '',
    status: client.status || '',
    notes: client.notes || ''
  }));

  return convertToCSV(csvData, headers);
};

export const importClients = async (csvText) => {
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

      const clientData = {
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

      if (clientData.email) {
        const existing = await clientRepo.findOne({ email: clientData.email });
        if (existing.length > 0) {
          results.errors.push({
            row: rowNumber,
            error: `Email ${clientData.email} already exists`
          });
          continue;
        }
      }

      const client = await clientRepo.create(clientData);
      results.success.push({
        row: rowNumber,
        id: client._id,
        name: `${client.firstName} ${client.lastName}`
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

