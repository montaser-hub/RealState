import * as propertyRepo from "./property.repository.js"
import AppError from "../../utils/appError.js"
import { getAllDocuments } from "../../utils/queryUtil.js"
import Contract from "../contract/contract.model.js"
import mongoose from "mongoose"

export const createProperty = async (data) => {
  // Check for referenceId uniqueness or other business rules
  const existing = await propertyRepo.findOne({ referenceId: data.referenceId });
  if (existing.length > 0) throw new AppError('Property referenceId already exists', 400);

  return await propertyRepo.create(data);
};

export const getProperty = async (id) => {
  const property = await propertyRepo.findById(id);
  if (!property) throw new AppError('Property not found', 404);
  return property;
};

export const getProperties = async (queryParams) => {
  const searchableFields = ['title', 'category', 'status', 'city', 'state', 'country', 'listingType'];
  
  // Handle expired contract filter
  let expiredPropertyIds = null;
  if (queryParams.hasExpiredContract === 'true') {
    // Find all contracts that are expired
    const now = new Date();
    const expiredContracts = await Contract.find({
      $or: [
        { status: 'expired' },
        { endDate: { $lt: now }, status: { $nin: ['terminated', 'cancelled'] } }
      ]
    }).select('propertyId');
    
    expiredPropertyIds = [...new Set(expiredContracts.map(c => c.propertyId.toString()))];
    
    if (expiredPropertyIds.length === 0) {
      // No properties with expired contracts
      return { data: [], total: 0, totalFiltered: 0 };
    }
    
    // Remove hasExpiredContract from queryParams to avoid filtering issues
    delete queryParams.hasExpiredContract;
  }
  
  // Get base result
  const result = await getAllDocuments(propertyRepo, queryParams, searchableFields);
  
  // Filter by expired contracts if needed
  if (expiredPropertyIds && expiredPropertyIds.length > 0) {
    const objectIds = expiredPropertyIds.map(id => new mongoose.Types.ObjectId(id));
    result.data = result.data.filter(property => 
      objectIds.some(id => id.toString() === property._id.toString())
    );
    result.totalFiltered = result.data.length;
  }
  
  return result;
};

export const updateProperty = async (id, data) => {
  const property = await propertyRepo.update(id, data);
  if (!property) throw new AppError('Property not found', 404);
  return property;
};

export const deleteProperty = async (id) => {
  const property = await propertyRepo.deleteOne(id);
  if (!property) throw new AppError('Property not found', 404);
  return property;
};

export const propertyStatus = async (id, status) => {
  const property = await propertyRepo.update(id, { status });
  if (!property) throw new AppError('Property not found', 404);
  return property;
};