import Contract from './contract.model.js';
import { generatePresignedUrl } from '../../utils/b2Upload.js';
import { config } from '../../configs/env.js';

/**
 * Generate presigned URL for contract document if it's stored in B2
 * @param {Object} contract - Contract document
 * @returns {Promise<Object>} Contract with processed document URLs
 */
const processContractDocument = async (contract) => {
  if (!contract) return contract;

  // Only generate signed URLs if B2 is enabled
  const useB2 = process.env.UPLOAD_TARGET === 'b2' || config.nodeEnv === 'production';
  
  if (useB2 && contract.documentFile) {
    try {
      // Check if documentFile is a B2 URL (contains bucket endpoint or starts with http)
      const isB2Url = contract.documentFile.includes(config.b2.endpoint) || 
                      contract.documentFile.startsWith('http');
      
      if (isB2Url) {
        const presignedUrl = await generatePresignedUrl(
          contract.documentFile,
          config.b2.signedUrlExpiry
        );
        
        // Replace documentFile with presigned URL for secure access (fallback to original)
        if (presignedUrl) {
          contract.documentFile = presignedUrl;
        }
      }
    } catch (error) {
      console.error('Error generating presigned URL for contract document:', error);
      // Fallback: keep original documentFile
    }
  }

  return contract;
};

export const create = async (data) => {
  const contract = await Contract.create(data);
  const populatedContract = await Contract.findById(contract._id)
    .populate('user', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate('client', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate({
      path: 'propertyId',
      select: 'title referenceId category listingType',
      populate: [
        {
          path: 'owner',
          select: 'firstName lastName fullName email contactNumber AlternativePhone'
        },
        {
          path: 'broker',
          select: 'firstName lastName fullName email contactNumber AlternativePhone'
        }
      ]
    });

  return await processContractDocument(populatedContract);
};

export const findById = async (id) => {
  const contract = await Contract.findById(id)
    .populate('user', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate('client', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate({
      path: 'propertyId',
      select: 'title referenceId category listingType',
      populate: [
        {
          path: 'owner',
          select: 'firstName lastName fullName email contactNumber AlternativePhone'
        },
        {
          path: 'broker',
          select: 'firstName lastName fullName email contactNumber AlternativePhone'
        }
      ]
    });

  if (!contract) return null;

  return await processContractDocument(contract);
};

export const update = async (id, data) => {
  const contract = await Contract.findByIdAndUpdate(id, data, { new: true })
    .populate('user', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate('client', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate({
      path: 'propertyId',
      select: 'title referenceId category listingType',
      populate: [
        {
          path: 'owner',
          select: 'firstName lastName fullName email contactNumber AlternativePhone'
        },
        {
          path: 'broker',
          select: 'firstName lastName fullName email contactNumber AlternativePhone'
        }
      ]
    });

  if (!contract) return null;

  return await processContractDocument(contract);
};

export const deleteOne = async (id) => {
  return Contract.findByIdAndDelete(id);
};

export const findOne = (filter) => {
  return Contract.find(filter)
};

export const findAll = () => {
  return Contract.find()
    .populate('user', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate('client', 'firstName lastName fullName email contactNumber AlternativePhone')
    .populate({
      path: 'propertyId',
      select: 'title referenceId category listingType',
      populate: [
        {
          path: 'owner',
          select: 'firstName lastName fullName email contactNumber AlternativePhone'
        },
        {
          path: 'broker',
          select: 'firstName lastName fullName email contactNumber AlternativePhone'
        }
      ]
    });
};

/**
 * Process contracts with presigned URLs for documents after query execution
 * @param {Array} contracts - Array of contract documents
 * @returns {Promise<Array>} Array of contracts with processed document URLs
 */
export const processContractsDocuments = async (contracts) => {
  if (!contracts || contracts.length === 0) {
    return contracts;
  }

  // Process documents for all contracts in parallel
  return await Promise.all(
    contracts.map(contract => processContractDocument(contract))
  );
};

export const countAll = () => Contract.countDocuments();

export const countFiltered = (filter) => Contract.countDocuments(filter);