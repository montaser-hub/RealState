import * as facilityService from './facility.service.js'
import catchAsync from "../../middlewares/ctachAsync.js";


export const createFacility = catchAsync(async (req, res) => {
  const data = req.body;
  const facility = await facilityService.createFacility(data);
  res.status(201).json({ message: 'Facility created', data: facility });
});

export const getFacility = catchAsync(async (req, res) => {
  const facility = await facilityService.getFacility(req.params.id);
  res.status(200).json({ message: 'Facility fetched', data: facility });
});

export const getFacilities = catchAsync(async (req, res) => {
  const { data, total, totalFiltered } = await facilityService.getFacilities(req.query);
  res.status(200).json({
    message: 'Facilities fetched',
    total,
    totalFiltered,
    data
  });
});

export const updateFacility = catchAsync(async (req, res) => {
  const facility = await facilityService.updateFacility(req.params.id, req.body);
  res.status(200).json({ message: 'Facility updated', data: facility });
});

export const deleteFacility = catchAsync(async (req, res) => {
  await facilityService.deleteFacility(req.params.id);
  res.status(200).json({ message: 'Facility deleted' });
});
