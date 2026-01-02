import * as reminderRepo from './reminder.repository.js';
import AppError from '../../utils/appError.js';
import { getAllDocuments } from '../../utils/queryUtil.js';
import * as googleCalendarService from '../googleCalendar/googleCalendar.service.js';

export const createReminder = async (data) => {
  const reminder = await reminderRepo.create(data);
  
  // Auto-sync to Google Calendar if connected
  try {
    const googleEventId = await googleCalendarService.createCalendarEvent(reminder);
    await reminderRepo.update(reminder._id, {
      googleEventId,
      syncedToGoogle: true,
    });
    // Return updated reminder with Google sync info
    return await reminderRepo.findById(reminder._id);
  } catch (error) {
    // Don't fail reminder creation if Google sync fails
    console.error('Failed to sync reminder to Google Calendar:', error.message);
    return reminder;
  }
};

export const getReminder = async (id) => {
  const reminder = await reminderRepo.findById(id);
  if (!reminder) throw new AppError('Reminder not found', 404);
  return reminder;
};

export const getReminders = async (queryParams) => {
  const searchableFields = ['title', 'description', 'category', 'priority', 'notes'];
  return await getAllDocuments(reminderRepo, queryParams, searchableFields);
};

export const updateReminder = async (id, data) => {
  const reminder = await reminderRepo.update(id, data);
  if (!reminder) throw new AppError('Reminder not found', 404);
  
  // Update Google Calendar event if synced
  if (reminder.syncedToGoogle && reminder.googleEventId) {
    try {
      await googleCalendarService.updateCalendarEvent(reminder.googleEventId, reminder);
    } catch (error) {
      console.error('Failed to update Google Calendar event:', error.message);
      // Don't fail reminder update if Google sync fails
    }
  }
  
  return reminder;
};

export const deleteReminder = async (id) => {
  const reminder = await reminderRepo.findById(id);
  if (!reminder) throw new AppError('Reminder not found', 404);
  
  // Delete Google Calendar event if synced
  if (reminder.syncedToGoogle && reminder.googleEventId) {
    try {
      await googleCalendarService.deleteCalendarEvent(reminder.googleEventId);
    } catch (error) {
      console.error('Failed to delete Google Calendar event:', error.message);
      // Don't fail reminder deletion if Google sync fails
    }
  }
  
  await reminderRepo.deleteOne(id);
  return reminder;
};




