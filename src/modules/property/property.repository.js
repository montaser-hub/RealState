import Property from './property.model.js';
import { generatePresignedUrlsForMedia } from '../../utils/b2Upload.js';
import { config } from '../../configs/env.js';

export const create = async (data) => {
  return await Property.create(data);
};

/**
 * Generate signed URLs for property media
 */
const processPropertyMedia = async (property) => {
  if (!property || !property.media || property.media.length === 0) {
    return property;
  }

  // Only generate signed URLs if B2 is enabled
  const useB2 = process.env.UPLOAD_TARGET === 'b2' || config.nodeEnv === 'production';
  
  if (useB2) {
    const mediaWithSignedUrls = await generatePresignedUrlsForMedia(
      property.media,
      config.b2.signedUrlExpiry
    );
    
    // Replace url with signedUrl for frontend access
    property.media = mediaWithSignedUrls.map(media => ({
      ...media,
      url: media.signedUrl || media.url, // Use signed URL, fallback to original
    }));
  }

  return property;
};

export const findById = async (id) => {
  const property = await Property.findById(id)
    .populate('owner', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate('broker', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate({
      path: 'media',
      select: 'url mediaType isPrimary order caption',
      options: { sort: { order: 1 } }
    })
    .populate({
      path: 'contracts',
      select: 'contractNumber startDate endDate status amount currency',
      options: { sort: { endDate: -1 } }
    });

  if (!property) return null;

  return await processPropertyMedia(property);
};

export const update = async (id, data) => {
  const property = await Property.findByIdAndUpdate(id, data, { new: true })
    .populate('owner', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate('broker', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate({
      path: 'media',
      select: 'url mediaType isPrimary order caption',
      options: { sort: { order: 1 } }
    })
    .populate({
      path: 'contracts',
      select: 'contractNumber startDate endDate status amount currency',
      options: { sort: { endDate: -1 } }
    });

  if (!property) return null;

  return await processPropertyMedia(property);
};

export const deleteOne = async (id) => {
  return Property.findByIdAndDelete(id);
};

export const findOne = (filter) => {
  return Property.find(filter)
};

/**
 * Get base query for filtering/pagination (used by getAllDocuments)
 * Returns Mongoose query object, not executed
 */
export const findAll = () => {
  return Property.find()
    .populate('owner', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate('broker', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate({
      path: 'media',
      select: 'url mediaType isPrimary order caption',
      options: { sort: { order: 1 } }
    })
    .populate({
      path: 'contracts',
      select: 'contractNumber startDate endDate status amount currency',
      options: { sort: { endDate: -1 } }
    });
};

/**
 * Process properties with signed URLs after query execution
 */
export const processPropertiesMedia = async (properties) => {
  if (!properties || properties.length === 0) {
    return properties;
  }

  // Process media for all properties in parallel
  return await Promise.all(
    properties.map(property => processPropertyMedia(property))
  );
};

export const countAll = () => Property.countDocuments();

export const countFiltered = (filter) => Property.countDocuments(filter);