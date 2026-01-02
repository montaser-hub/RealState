import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../configs/env.js';

// Initialize B2 S3-compatible client
const b2Client = new S3Client({
  endpoint: `https://${config.b2.endpoint}`,
  region: config.b2.region,
  credentials: {
    accessKeyId: config.b2.applicationKeyId,
    secretAccessKey: config.b2.applicationKey,
  },
  forcePathStyle: true,
});

/**
 * Upload file to Backblaze B2
 * @param {Buffer} buffer - File buffer
 * @param {string} key - File path/key in bucket
 * @param {string} contentType - MIME type
 * @returns {Promise<string>} Public URL of uploaded file
 */
export const uploadToB2 = async (buffer, key, contentType = 'application/octet-stream') => {
  const command = new PutObjectCommand({
    Bucket: config.b2.bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await b2Client.send(command);

  // Return public URL
  return `https://${config.b2.bucketName}.${config.b2.endpoint}/${key}`;
};

/**
 * Upload image to B2
 * @param {Buffer} buffer - Image buffer
 * @param {string} folder - Folder path (e.g., 'users', 'properties')
 * @param {string} filename - Filename
 * @returns {Promise<string>} Public URL
 */
export const uploadImageToB2 = async (buffer, folder, filename) => {
  const key = `${folder}/${filename}`;
  return await uploadToB2(buffer, key, 'image/jpeg');
};

/**
 * Upload PDF to B2
 * @param {Buffer} buffer - PDF buffer
 * @param {string} folder - Folder path (e.g., 'payments')
 * @param {string} filename - Filename
 * @returns {Promise<string>} Public URL
 */
export const uploadPDFToB2 = async (buffer, folder, filename) => {
  const key = `${folder}/${filename}`;
  return await uploadToB2(buffer, key, 'application/pdf');
};

/**
 * Extract key from B2 URL
 * @param {string} url - Full B2 URL
 * @returns {string} Key/path in bucket
 */
const extractKeyFromUrl = (url) => {
  if (!url) return null;
  
  // Handle both formats:
  // https://bucket.endpoint/key
  // https://bucket.endpoint/key?query
  try {
    const urlObj = new URL(url);
    // Remove leading slash and query params
    return urlObj.pathname.substring(1).split('?')[0];
  } catch (error) {
    // If URL parsing fails, try string extraction
    const match = url.match(/https?:\/\/[^\/]+\/(.+?)(?:\?|$)/);
    return match ? match[1] : null;
  }
};

/**
 * Generate presigned URL for B2 object
 * @param {string} url - Direct B2 URL or key
 * @param {number} expiresIn - Expiry time in seconds (default: 1 hour)
 * @returns {Promise<string>} Presigned URL
 */
export const generatePresignedUrl = async (url, expiresIn = 3600) => {
  if (!url) return null;

  try {
    // Extract key from URL or use as-is if already a key
    const key = url.startsWith('http') ? extractKeyFromUrl(url) : url;
    
    if (!key) {
      throw new Error('Invalid URL or key');
    }

    const command = new GetObjectCommand({
      Bucket: config.b2.bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(b2Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    // Return original URL as fallback
    return url;
  }
};

/**
 * Generate presigned URLs for multiple media items
 * @param {Array} mediaArray - Array of media objects with url property
 * @param {number} expiresIn - Expiry time in seconds (default: 1 hour)
 * @returns {Promise<Array>} Array of media objects with signedUrl property
 */
export const generatePresignedUrlsForMedia = async (mediaArray, expiresIn = 3600) => {
  if (!mediaArray || mediaArray.length === 0) {
    return [];
  }

  try {
    // Generate all signed URLs in parallel for better performance
    const signedUrlPromises = mediaArray.map(async (media) => {
      if (!media.url) {
        return { ...media, signedUrl: null };
      }

      const signedUrl = await generatePresignedUrl(media.url, expiresIn);
      return {
        ...media.toObject ? media.toObject() : media,
        signedUrl,
        // Keep original URL for reference
        originalUrl: media.url,
      };
    });

    return await Promise.all(signedUrlPromises);
  } catch (error) {
    console.error('Error generating presigned URLs:', error);
    // Return original media array as fallback
    return mediaArray;
  }
};

