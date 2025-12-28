import * as featureService from './feature.service.js'
import catchAsync from "../../middlewares/ctachAsync.js";


export const createFeature = catchAsync(async (req, res) => {
  const data = req.body;
  const feature = await featureService.createFeature(data);
  res.status(201).json({ message: 'Feature created', data: feature });
});

export const getFeature = catchAsync(async (req, res) => {
  const feature = await featureService.getFeature(req.params.id);
  res.status(200).json({ message: 'Feature fetched', data: feature });
});

export const getFeatures = catchAsync(async (req, res) => {
  const { data, total, totalFiltered } = await featureService.getFeatures(req.query);
  res.status(200).json({
    message: 'Features fetched',
    total,
    totalFiltered,
    data
  });
});

export const updateFeature = catchAsync(async (req, res) => {
  const feature = await featureService.updateFeature(req.params.id, req.body);
  res.status(200).json({ message: 'Feature updated', data: feature });
});

export const deleteFeature = catchAsync(async (req, res) => {
  await featureService.deleteFeature(req.params.id);
  res.status(200).json({ message: 'Feature deleted' });
});
