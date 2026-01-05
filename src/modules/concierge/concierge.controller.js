import * as conciergeService from './concierge.service.js';
import catchAsync from '../../middlewares/ctachAsync.js';
import { resizeAndSaveImage } from '../../utils/fileUpload.js';
import { uploadSingle } from '../../utils/multer.js';

// Upload and resize concierge photo
export const uploadConciergePhoto = uploadSingle('photo', 'image');

export const resizeConciergePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = await resizeAndSaveImage(req.file, {
    folder: 'concierges',
    prefix: `concierge-${Date.now()}`,
  });

  next();
});

export const createConcierge = catchAsync(async (req, res) => {
  const data = { ...req.body };
  if (req.file && req.file.filename) {
    data.photo = req.file.filename;
  }
  const concierge = await conciergeService.createConcierge(data);
  res.status(201).json({ message: 'Concierge created successfully', data: concierge });
});

export const getConcierge = catchAsync(async (req, res) => {
  const concierge = await conciergeService.getConcierge(req.params.id);
  res.status(200).json({ message: 'Concierge fetched successfully', data: concierge });
});

export const getConcierges = catchAsync(async (req, res) => {
  const query = { ...req.query };
  const { data, total, totalFiltered } = await conciergeService.getConcierges(query);
  res.status(200).json({
    message: 'Concierges fetched successfully',
    totalFiltered,
    total,
    limit: query.limit,
    page: query.page,
    data
  });
});

export const updateConcierge = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = { ...req.body };
  if (req.file && req.file.filename) {
    data.photo = req.file.filename;
  }
  const concierge = await conciergeService.updateConcierge(id, data);
  res.status(200).json({ message: 'Concierge updated successfully', data: concierge });
});

export const deleteConcierge = catchAsync(async (req, res) => {
  await conciergeService.deleteConcierge(req.params.id);
  res.status(200).json({ message: 'Concierge deleted successfully' });
});

export const exportConcierges = catchAsync(async (req, res) => {
  const csv = await conciergeService.exportConcierges(req.query);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=concierges-export.csv');
  res.status(200).send(csv);
});

export const importConcierges = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'CSV file is required' });
  }

  const csvText = req.file.buffer.toString('utf-8');
  const results = await conciergeService.importConcierges(csvText);
  
  res.status(200).json({
    message: 'Import completed',
    total: results.success.length + results.errors.length,
    success: results.success.length,
    errors: results.errors.length,
    details: results
  });
});

