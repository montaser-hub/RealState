import * as contractService from './contract.service.js'
import catchAsync from "../../middlewares/ctachAsync.js";


export const createContract = catchAsync(async (req, res) => {
  const data = req.body;
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
  const contract = await contractService.updateContract(req.params.id, req.body);
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