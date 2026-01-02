import * as propertyMediaService from './propertyMedia.service.js';
import catchAsync from '../../middlewares/ctachAsync.js';
import { resizeAndSaveImage } from '../../utils/fileUpload.js';
import { uploadMultiple } from '../../utils/multer.js';

/**
 * Upload property images (supports single or multiple)
 */
export const uploadPropertyImages = uploadMultiple('images', 10, 'image');

export const processPropertyImages = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      message: 'No images provided',
    });
  }

  const { propertyId } = req.params;
  if (!propertyId) {
    return next(new Error('Property ID is required'));
  }

  const imageUrls = await Promise.all(
    req.files.map(file =>
      resizeAndSaveImage(file, {
        folder: 'properties',
        prefix: `property-${propertyId}`,
        width: 1200,
        height: 800,
        quality: 85,
      })
    )
  );

  req.files = req.files.map((file, index) => ({
    ...file,
    url: imageUrls[index],
    mediaType: 'image',
  }));

  next();
});

/**
 * Upload single or multiple property images
 * POST /api/v1/properties/:propertyId/media
 */
export const createPropertyMedia = catchAsync(async (req, res, next) => {
  const { propertyId } = req.params;
  const { captions, primaryIndex } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      message: 'No images provided',
    });
  }

  // Handle single or multiple images
  const isSingle = req.files.length === 1;
  const singleImage = isSingle ? req.files[0] : null;

  if (isSingle) {
    // Single image upload
    const mediaData = {
      url: singleImage.url,
      mediaType: singleImage.mediaType || 'image',
      caption: req.body.caption || null,
    };

    const media = await propertyMediaService.createPropertyMedia(propertyId, mediaData);

    // Set as primary if requested
    if (req.body.isPrimary === 'true' || req.body.isPrimary === true) {
      await propertyMediaService.setPrimaryMedia(propertyId, media._id);
      media.isPrimary = true;
    }

    return res.status(201).json({
      message: 'Property image uploaded successfully',
      data: media,
    });
  } else {
    // Multiple images upload
    const mediaArray = req.files.map((file, index) => ({
      url: file.url,
      mediaType: file.mediaType || 'image',
      caption: captions && Array.isArray(captions) && captions[index] ? captions[index] : null,
    }));

    const createdMedia = await propertyMediaService.createMultiplePropertyMedia(propertyId, mediaArray);

    // Set primary if specified
    if (primaryIndex !== undefined && primaryIndex !== null) {
      const primaryIdx = parseInt(primaryIndex);
      if (primaryIdx >= 0 && primaryIdx < createdMedia.length) {
        await propertyMediaService.setPrimaryMedia(propertyId, createdMedia[primaryIdx]._id);
        createdMedia[primaryIdx].isPrimary = true;
      }
    }

    return res.status(201).json({
      message: 'Property images uploaded successfully',
      data: createdMedia,
    });
  }
});

/**
 * Get all media for a property
 * GET /api/v1/properties/:propertyId/media
 */
export const getPropertyMediaList = catchAsync(async (req, res, next) => {
  const { propertyId } = req.params;

  const media = await propertyMediaService.getPropertyMediaList(propertyId);

  res.status(200).json({
    message: 'Property media fetched successfully',
    data: media,
  });
});

/**
 * Set primary media
 * PATCH /api/v1/properties/:propertyId/media/:id/set-primary
 */
export const setPrimaryMedia = catchAsync(async (req, res, next) => {
  const { propertyId, id } = req.params;

  const media = await propertyMediaService.setPrimaryMedia(propertyId, id);

  res.status(200).json({
    message: 'Primary image set successfully',
    data: media,
  });
});

/**
 * Reorder property media
 * PATCH /api/v1/properties/:propertyId/media/reorder
 */
export const reorderPropertyMedia = catchAsync(async (req, res, next) => {
  const { propertyId } = req.params;
  const { mediaIds } = req.body;

  if (!mediaIds || !Array.isArray(mediaIds)) {
    return res.status(400).json({
      message: 'mediaIds must be an array',
    });
  }

  const media = await propertyMediaService.reorderPropertyMedia(propertyId, mediaIds);

  res.status(200).json({
    message: 'Property media reordered successfully',
    data: media,
  });
});

/**
 * Delete property media
 * DELETE /api/v1/properties/:propertyId/media/:id
 */
export const deletePropertyMedia = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await propertyMediaService.deletePropertyMedia(id);

  res.status(200).json({
    message: 'Property image deleted successfully',
  });
});
