import * as contractService from './contract.service.js'
import catchAsync from "../../middlewares/ctachAsync.js";
import { resizeAndSaveImage } from "../../utils/fileUpload.js";
import { uploadSingle } from "../../utils/multer.js";

// Upload and resize contract document
// Only process if content-type is multipart/form-data, otherwise skip
const multerUpload = uploadSingle('document', 'image');
export const uploadContractDocument = (req, res, next) => {
  // Only run multer if content-type is multipart/form-data
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    return multerUpload(req, res, next);
  }
  // For JSON requests, skip multer and continue
  next();
};

export const resizeContractDocument = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = await resizeAndSaveImage(req.file, {
    folder: 'contracts',
    prefix: `contract-${Date.now()}`,
  });

  next();
});

export const createContract = catchAsync(async (req, res) => {
  const data = { ...req.body };
  
  // Handle document: either uploaded file or URL
  if (req.file && req.file.filename) {
    // File was uploaded - store in documentFile
    data.documentFile = req.file.filename;
    // Clear documentUrl if file is uploaded
    if (data.documentUrl) {
      delete data.documentUrl;
    }
  } else if (data.documentUrl) {
    // URL was provided - store in documentUrl
    // Clear documentFile if URL is provided
    if (data.documentFile) {
      delete data.documentFile;
    }
  }
  
  const contract = await contractService.createContract(data);
  res.status(201).json({ message: 'Contract created', data: contract });
});

export const getContract = catchAsync(async (req, res) => {
  const contract = await contractService.getContract(req.params.id);
  res.status(200).json({ message: 'Contract fetched', data: contract });
});

export const getContracts = catchAsync(async (req, res) => {
  const { data, total, totalFiltered } = await contractService.getContracts(req.query);
  res.status(200).json({
    message: 'Contracts fetched',
    total,
    totalFiltered,
    data
  });
});

export const updateContract = catchAsync(async (req, res) => {
  const data = { ...req.body };
  
  // Handle document: either uploaded file or URL
  if (req.file && req.file.filename) {
    // File was uploaded - store in documentFile
    data.documentFile = req.file.filename;
    // Clear documentUrl if file is uploaded
    if (data.documentUrl) {
      delete data.documentUrl;
    }
  } else if (data.documentUrl) {
    // URL was provided - store in documentUrl
    // Clear documentFile if URL is provided
    if (data.documentFile) {
      delete data.documentFile;
    }
  }
  
  const contract = await contractService.updateContract(req.params.id, data);
  res.status(200).json({ message: 'Contract updated', data: contract });
});

export const deleteContract = catchAsync(async (req, res) => {
  await contractService.deleteContract(req.params.id);
  res.status(200).json({ message: 'Contract deleted' });
});

export const updateContractStatus = catchAsync(async (req, res) => {
  const status = req.body?.status;
  const contract = await contractService.contractStatus(req.params.id, status);
  res.status(200).json({ message: 'Contract status updated', data: contract });
});