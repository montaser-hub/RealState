import * as facilityRepo from "./facility.repository.js"
import AppError from "../../utils/appError.js"
import { getAllDocuments } from "../../utils/queryUtil.js"

export const createFacility = async (data) => {
  // Check for propertyId uniqueness or other business rules
  const existing = await facilityRepo.findOne({ propertyId: data.propertyId });
  if (existing) throw new AppError('Facility with this propertyId already exists', 400);

  return await facilityRepo.create(data);
};

export const getFacility = async (id) => {
  const facility = await facilityRepo.findById(id);
  if (!facility) throw new AppError('Facility not found', 404);
  return facility;
};

export const getFacilities = async (queryParams) => {
  return await getAllDocuments(facilityRepo, queryParams);
};

export const updateFacility = async (id, data) => {
  const facility = await facilityRepo.update(id, data);
  if (!facility) throw new AppError('Facility not found', 404);
  return facility;
};

export const deleteFacility = async (id) => {
  const facility = await facilityRepo.deleteOne(id);
  if (!facility) throw new AppError('Facility not found', 404);
  return facility;
};

