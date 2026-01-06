import * as contractRepo from "./contract.repository.js"
import AppError from "../../utils/appError.js"
import { getAllDocuments } from "../../utils/queryUtil.js"

export const createContract = async (data) => {
  // Check for contractNumber uniqueness or other business rules
  const existing = await contractRepo.findOne({ contractNumber: data.contractNumber });
  if (existing.length > 0) throw new AppError('Contract contractNumber already exists', 400);

  return await contractRepo.create(data);
};

export const getContract = async (id) => {
  const contract = await contractRepo.findById(id);
  if (!contract) throw new AppError('Contract not found', 404);
  return contract;
};

export const getContracts = async (queryParams) => {
  const searchableFields = ['status', 'amount', 'currency', 'contractNumber'];
  return await getAllDocuments(contractRepo, queryParams, searchableFields);
};

export const updateContract = async (id, data) => {
  const contract = await contractRepo.update(id, data);
  if (!contract) throw new AppError('Contract not found', 404);
  return contract;
};

export const deleteContract = async (id) => {
  const contract = await contractRepo.deleteOne(id);
  if (!contract) throw new AppError('Contract not found', 404);
  return contract;
};

export const contractStatus = async (id, status) => {
  const contract = await contractRepo.update(id, { status });
  if (!contract) throw new AppError('Contract not found', 404);
  return contract;
};