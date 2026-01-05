import * as reminderService from './reminder.service.js';
import catchAsync from '../../middlewares/ctachAsync.js';

export const createReminder = catchAsync(async (req, res) => {
  const data = { ...req.body, createdBy: req.user._id };
  const reminder = await reminderService.createReminder(data);
  res.status(201).json({
    message: 'Reminder created successfully',
    data: reminder
  });
});

export const getReminder = catchAsync(async (req, res) => {
  const reminder = await reminderService.getReminder(req.params.id);
  res.status(200).json({
    message: 'Reminder fetched successfully',
    data: reminder
  });
});

export const getReminders = catchAsync(async (req, res) => {
  const { data, total, totalFiltered } = await reminderService.getReminders(req.query);
  res.status(200).json({
    message: 'Reminders fetched successfully',
    total,
    totalFiltered,
    data
  });
});

export const updateReminder = catchAsync(async (req, res) => {
  const reminder = await reminderService.updateReminder(req.params.id, req.body);
  res.status(200).json({
    message: 'Reminder updated successfully',
    data: reminder
  });
});

export const deleteReminder = catchAsync(async (req, res) => {
  await reminderService.deleteReminder(req.params.id);
  res.status(200).json({
    message: 'Reminder deleted successfully'
  });
});






