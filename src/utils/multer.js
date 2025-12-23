import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (type = 'image') => (req, file, cb) => {
  if (type === 'image' && !file.mimetype.startsWith('image')) {
    return cb(new Error('Please upload a valid image file'), false);
  }
  cb(null, true);
};

export const uploadSingle = (fieldName, type = 'image') => {
  return multer({ storage, fileFilter: fileFilter(type), limits: { fileSize: 5 * 1024 * 1024 } }).single(fieldName);
};

export const uploadMultiple = (fieldName, maxCount = 5, type = 'image') => {
  return multer({ storage, fileFilter: fileFilter(type), limits: { fileSize: 5 * 1024 * 1024 } }).array(fieldName, maxCount);
};
