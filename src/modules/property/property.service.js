import * as propertyRepo from "./property.repository.js"
import AppError from "../../utils/appError.js"
import { getAllDocuments } from "../../utils/queryUtil.js"
import Contract from "../contract/contract.model.js"
import mongoose from "mongoose"
import Owner from "../owner/owner.model.js"

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
  
  // Handle owner name search
  let ownerFilter = null;
  if (queryParams.ownerName) {
    const ownerName = queryParams.ownerName.trim();
    const nameParts = ownerName.split(/\s+/).filter(Boolean);
    
    if (nameParts.length > 0) {
      const ownerQuery = {
        $or: nameParts.map(part => ({
          $or: [
            { firstName: new RegExp(part, 'i') },
            { lastName: new RegExp(part, 'i') },
            { email: new RegExp(part, 'i') }
          ]
        }))
      };
      
      const owners = await Owner.find(ownerQuery).select('_id');
      const ownerIds = owners.map(o => o._id);
      
      if (ownerIds.length === 0) {
        // No owners found with this name
        return { data: [], total: 0, totalFiltered: 0 };
      }
      
      // Store filter to apply after getAllDocuments
      ownerFilter = { realOwner: { $in: ownerIds } };
      delete queryParams.ownerName;
    }
  }
  
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
  
  // Apply owner filter if needed (filter after population)
  if (ownerFilter) {
    const ownerIdStrings = ownerFilter.realOwner.$in.map(id => id.toString());
    result.data = result.data.filter(property => 
      property.realOwner && ownerIdStrings.includes(property.realOwner._id?.toString() || property.realOwner.toString())
    );
    result.totalFiltered = result.data.length;
  }
  
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