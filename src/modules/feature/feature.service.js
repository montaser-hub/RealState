import * as featureRepo from "./feature.repository.js"
import AppError from "../../utils/appError.js"
import { getAllDocuments } from "../../utils/queryUtil.js"

export const createFeature = async (data) => {
  // Check for propertyId uniqueness or other business rules
  const existing = await featureRepo.findOne({ propertyId: data.propertyId });
  if (existing) throw new AppError('Feature with this propertyId already exists', 400);

  return await featureRepo.create(data);
};

export const getFeature = async (id) => {
  const feature = await featureRepo.findById(id);
  if (!feature) throw new AppError('Feature not found', 404);
  return feature;
};

export const getFeatures = async (queryParams) => {
  return await getAllDocuments(featureRepo, queryParams);
};

export const updateFeature = async (id, data) => {
  const feature = await featureRepo.update(id, data);
  if (!feature) throw new AppError('Feature not found', 404);
  return feature;
};

export const deleteFeature = async (id) => {
  const feature = await featureRepo.deleteOne(id);
  if (!feature) throw new AppError('Feature not found', 404);
  return feature;
};

