import * as propertyService from './property.service.js'
import catchAsync from "../../middlewares/ctachAsync.js";


export const createProperty = catchAsync(async (req, res) => {
  const data = req.body;
  const property = await propertyService.createProperty(data);
  res.status(201).json({ message: 'Property created', data: property });
});

export const getProperty = catchAsync(async (req, res) => {
  const property = await propertyService.getProperty(req.params.id);
  res.status(200).json({ message: 'Property fetched', data: property });
});

export const getProperties = catchAsync(async (req, res) => {
  const { data, total, totalFiltered } = await propertyService.getProperties(req.query);
  res.status(200).json({
    message: 'Properties fetched',
    total,
    totalFiltered,
    data
  });
});

export const updateProperty = catchAsync(async (req, res) => {
  const property = await propertyService.updateProperty(req.params.id, req.body);
  res.status(200).json({ message: 'Property updated', data: property });
});

export const deleteProperty = catchAsync(async (req, res) => {
  await propertyService.deleteProperty(req.params.id);
  res.status(200).json({ message: 'Property deleted' });
});

export const propertyStatus = catchAsync(async (req, res) => {
  const status = req.body?.status;
  const property = await propertyService.propertyStatus(req.params.id, status);
  res.status(200).json({ message: 'Property status updated', data: property });
});