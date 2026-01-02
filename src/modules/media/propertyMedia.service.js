import * as propertyMediaRepo from './propertyMedia.repository.js';
import * as propertyRepo from '../property/property.repository.js';
import { generatePresignedUrlsForMedia } from '../../utils/b2Upload.js';
import { config } from '../../configs/env.js';
import AppError from '../../utils/appError.js';

/**
 * Create property media
 */
export const createPropertyMedia = async (propertyId, data) => {
  // Verify property exists
  const property = await propertyRepo.findById(propertyId);
  if (!property) {
    throw new AppError('Property not found', 404);
  }

  // Get current media count for ordering
  const existingMedia = await propertyMediaRepo.findByProperty(propertyId);
  const order = existingMedia.length + 1;

  // If this is the first media, set it as primary
  const isPrimary = existingMedia.length === 0;

  const mediaData = {
    ...data,
    property: propertyId,
    order,
    isPrimary,
  };

  return await propertyMediaRepo.create(mediaData);
};

/**
 * Create multiple property media
 */
export const createMultiplePropertyMedia = async (propertyId, mediaArray) => {
  // Verify property exists
  const property = await propertyRepo.findById(propertyId);
  if (!property) {
    throw new AppError('Property not found', 404);
  }

  // Get current media count for ordering
  const existingMedia = await propertyMediaRepo.findByProperty(propertyId);
  let startOrder = existingMedia.length + 1;

  // If no existing media, first one should be primary
  const isFirstMedia = existingMedia.length === 0;

  const mediaDataArray = mediaArray.map((media, index) => ({
    ...media,
    property: propertyId,
    order: startOrder + index,
    isPrimary: isFirstMedia && index === 0,
  }));

  return await propertyMediaRepo.createMultiple(mediaDataArray);
};

/**
 * Get all media for a property
 */
export const getPropertyMediaList = async (propertyId) => {
  // Verify property exists
  const property = await propertyRepo.findById(propertyId);
  if (!property) {
    throw new AppError('Property not found', 404);
  }

  const media = await propertyMediaRepo.findByProperty(propertyId);

  // Generate signed URLs if B2 is enabled
  const useB2 = process.env.UPLOAD_TARGET === 'b2' || config.nodeEnv === 'production';
  
  if (useB2 && media.length > 0) {
    const mediaWithSignedUrls = await generatePresignedUrlsForMedia(
      media,
      config.b2.signedUrlExpiry
    );
    
    return mediaWithSignedUrls.map(m => ({
      ...m.toObject ? m.toObject() : m,
      url: m.signedUrl || m.url,
    }));
  }

  return media;
};

/**
 * Delete property media
 */
export const deletePropertyMedia = async (id) => {
  const media = await propertyMediaRepo.findById(id);
  if (!media) {
    throw new AppError('Property media not found', 404);
  }

  const deleted = await propertyMediaRepo.deleteOne(id);

  // If deleted media was primary, set first remaining as primary
  if (deleted.isPrimary) {
    const remainingMedia = await propertyMediaRepo.findByProperty(media.property);
    if (remainingMedia.length > 0) {
      await propertyMediaRepo.update(remainingMedia[0]._id, { isPrimary: true });
    }
  }

  // Reorder remaining media
  const allMedia = await propertyMediaRepo.findByProperty(media.property);
  if (allMedia.length > 0) {
    const reorderUpdates = allMedia.map((m, index) => ({
      updateOne: {
        filter: { _id: m._id },
        update: { order: index + 1 },
      },
    }));
    await propertyMediaRepo.reorder(media.property, allMedia.map(m => m._id));
  }

  return deleted;
};

/**
 * Set primary media
 */
export const setPrimaryMedia = async (propertyId, mediaId) => {
  // Verify property exists
  const property = await propertyRepo.findById(propertyId);
  if (!property) {
    throw new AppError('Property not found', 404);
  }

  // Verify media exists and belongs to property
  const media = await propertyMediaRepo.findById(mediaId);
  if (!media || media.property.toString() !== propertyId) {
    throw new AppError('Property media not found', 404);
  }

  return await propertyMediaRepo.setPrimary(propertyId, mediaId);
};

/**
 * Reorder property media
 */
export const reorderPropertyMedia = async (propertyId, mediaIds) => {
  // Verify property exists
  const property = await propertyRepo.findById(propertyId);
  if (!property) {
    throw new AppError('Property not found', 404);
  }

  // Verify all media belong to this property
  const existingMedia = await propertyMediaRepo.findByProperty(propertyId);
  const existingIds = existingMedia.map(m => m._id.toString());
  
  const invalidIds = mediaIds.filter(id => !existingIds.includes(id.toString()));
  if (invalidIds.length > 0) {
    throw new AppError('Some media IDs do not belong to this property', 400);
  }

  return await propertyMediaRepo.reorder(propertyId, mediaIds);
};

