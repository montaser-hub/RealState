import * as clientService from './client.service.js';
import catchAsync from '../../middlewares/ctachAsync.js';
import { resizeAndSaveImage } from '../../utils/fileUpload.js';
import { uploadSingle } from '../../utils/multer.js';

// Upload and resize client photo
export const uploadClientPhoto = uploadSingle('photo', 'image');

export const resizeClientPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = await resizeAndSaveImage(req.file, {
    folder: 'clients',
    prefix: `client-${Date.now()}`,
  });

  next();
});

export const createClient = catchAsync(async (req, res) => {
  const data = { ...req.body };
  if (req.file && req.file.filename) {
    data.photo = req.file.filename;
  }
  const client = await clientService.createClient(data);
  res.status(201).json({ message: 'Client created successfully', data: client });
});

export const getClient = catchAsync(async (req, res) => {
  const client = await clientService.getClient(req.params.id);
  res.status(200).json({ message: 'Client fetched successfully', data: client });
});

export const getClients = catchAsync(async (req, res) => {
  const query = { ...req.query };
  const { data, total, totalFiltered } = await clientService.getClients(query);
  res.status(200).json({
    message: 'Clients fetched successfully',
    totalFiltered,
    total,
    limit: query.limit,
    page: query.page,
    data
  });
});

export const updateClient = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = { ...req.body };
  if (req.file && req.file.filename) {
    data.photo = req.file.filename;
  }
  const client = await clientService.updateClient(id, data);
  res.status(200).json({ message: 'Client updated successfully', data: client });
});

export const deleteClient = catchAsync(async (req, res) => {
  await clientService.deleteClient(req.params.id);
  res.status(200).json({ message: 'Client deleted successfully' });
});

export const exportClients = catchAsync(async (req, res) => {
  const csv = await clientService.exportClients(req.query);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=clients-export.csv');
  res.status(200).send(csv);
});

export const importClients = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'CSV file is required' });
  }

  const csvText = req.file.buffer.toString('utf-8');
  const results = await clientService.importClients(csvText);
  
  res.status(200).json({
    message: 'Import completed',
    total: results.success.length + results.errors.length,
    success: results.success.length,
    errors: results.errors.length,
    details: results
  });
});

