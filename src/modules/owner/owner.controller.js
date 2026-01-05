import * as ownerService from './owner.service.js';
import catchAsync from '../../middlewares/ctachAsync.js';
import { resizeAndSaveImage } from '../../utils/fileUpload.js';
import { uploadSingle } from '../../utils/multer.js';

// Upload and resize owner photo
export const uploadOwnerPhoto = uploadSingle('photo', 'image');

export const resizeOwnerPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = await resizeAndSaveImage(req.file, {
    folder: 'owners',
    prefix: `owner-${Date.now()}`,
  });

  next();
});

export const createOwner = catchAsync(async (req, res) => {
  const data = { ...req.body };
  if (req.file && req.file.filename) {
    data.photo = req.file.filename;
  }
  const owner = await ownerService.createOwner(data);
  res.status(201).json({ message: 'Owner created successfully', data: owner });
});

export const getOwner = catchAsync(async (req, res) => {
  const owner = await ownerService.getOwner(req.params.id);
  res.status(200).json({ message: 'Owner fetched successfully', data: owner });
});

export const getOwners = catchAsync(async (req, res) => {
  const query = { ...req.query };
  const { data, total, totalFiltered } = await ownerService.getOwners(query);
  res.status(200).json({
    message: 'Owners fetched successfully',
    totalFiltered,
    total,
    limit: query.limit,
    page: query.page,
    data
  });
});

export const updateOwner = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = { ...req.body };
  if (req.file && req.file.filename) {
    data.photo = req.file.filename;
  }
  const owner = await ownerService.updateOwner(id, data);
  res.status(200).json({ message: 'Owner updated successfully', data: owner });
});

export const deleteOwner = catchAsync(async (req, res) => {
  await ownerService.deleteOwner(req.params.id);
  res.status(200).json({ message: 'Owner deleted successfully' });
});

export const exportOwners = catchAsync(async (req, res) => {
  const csv = await ownerService.exportOwners(req.query);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=owners-export.csv');
  res.status(200).send(csv);
});

export const importOwners = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'CSV file is required' });
  }

  const csvText = req.file.buffer.toString('utf-8');
  const results = await ownerService.importOwners(csvText);
  
  res.status(200).json({
    message: 'Import completed',
    total: results.success.length + results.errors.length,
    success: results.success.length,
    errors: results.errors.length,
    details: results
  });
});

