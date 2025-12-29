import * as propertyRepo from "./property.repository.js"
import AppError from "../../utils/appError.js"
import { getAllDocuments } from "../../utils/queryUtil.js"

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
  return await getAllDocuments(propertyRepo, queryParams, searchableFields);
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