import { google } from 'googleapis';
import { config } from '../../configs/env.js';
import * as googleCalendarRepo from './googleCalendar.repository.js';
import AppError from '../../utils/appError.js';

const oauth2Client = new google.auth.OAuth2(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
);

// Get OAuth URL for authorization
export const getAuthUrl = (userId) => {
  const state = Buffer.from(JSON.stringify({ userId })).toString('base64');
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.google.scopes,
    prompt: 'consent', // Force consent to get refresh token
    state: state, // Store user ID in state
  });
  return authUrl;
};

// Exchange authorization code for tokens
export const handleCallback = async (code, state) => {
  try {
    // Extract user ID from state if provided
    let userId = null;
    if (state) {
      try {
        const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
        userId = decodedState.userId;
      } catch (e) {
        // State parsing failed, continue without user ID
      }
    }

    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.access_token || !tokens.refresh_token) {
      throw new AppError('Failed to get tokens from Google', 400);
    }

    const expiryDate = tokens.expiry_date 
      ? new Date(tokens.expiry_date) 
      : new Date(Date.now() + 3600 * 1000); // Default 1 hour

    await googleCalendarRepo.updateConfig({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpiry: expiryDate,
      isConnected: true,
      connectedBy: userId,
      connectedAt: new Date(),
    });

    return { success: true, message: 'Google Calendar connected successfully' };
  } catch (error) {
    throw new AppError(`Failed to connect Google Calendar: ${error.message}`, 400);
  }
};

// Get authenticated OAuth client
const getAuthenticatedClient = async () => {
  const configData = await googleCalendarRepo.getConfig();
  
  if (!configData.isConnected) {
    throw new AppError('Google Calendar is not connected', 400);
  }

  const { accessToken, refreshToken } = configData.decryptTokens();
  
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  // Refresh token if expired
  if (configData.tokenExpiry <= new Date()) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      const expiryDate = credentials.expiry_date 
        ? new Date(credentials.expiry_date) 
        : new Date(Date.now() + 3600 * 1000);

      await googleCalendarRepo.updateConfig({
        accessToken: credentials.access_token,
        refreshToken: credentials.refresh_token || refreshToken,
        tokenExpiry: expiryDate,
      });

      oauth2Client.setCredentials(credentials);
    } catch (error) {
      await googleCalendarRepo.disconnect();
      throw new AppError('Failed to refresh Google Calendar token. Please reconnect.', 401);
    }
  }

  return oauth2Client;
};

// Create event in Google Calendar
export const createCalendarEvent = async (reminder) => {
  try {
    const auth = await getAuthenticatedClient();
    const calendar = google.calendar({ version: 'v3', auth });

    // Parse date and time
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const eventDate = new Date(reminder.date);
    eventDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + 1); // Default 1 hour duration

    const event = {
      summary: reminder.title,
      description: `${reminder.description}\n\nCategory: ${reminder.category}\nPriority: ${reminder.priority}${reminder.notes ? `\nNotes: ${reminder.notes}` : ''}`,
      start: {
        dateTime: eventDate.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'UTC',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return response.data.id; // Return Google Event ID
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    throw new AppError(`Failed to create Google Calendar event: ${error.message}`, 500);
  }
};

// Update event in Google Calendar
export const updateCalendarEvent = async (googleEventId, reminder) => {
  try {
    const auth = await getAuthenticatedClient();
    const calendar = google.calendar({ version: 'v3', auth });

    const [hours, minutes] = reminder.time.split(':').map(Number);
    const eventDate = new Date(reminder.date);
    eventDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + 1);

    const event = {
      summary: reminder.title,
      description: `${reminder.description}\n\nCategory: ${reminder.category}\nPriority: ${reminder.priority}${reminder.notes ? `\nNotes: ${reminder.notes}` : ''}`,
      start: {
        dateTime: eventDate.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'UTC',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    await calendar.events.update({
      calendarId: 'primary',
      eventId: googleEventId,
      resource: event,
    });

    return true;
  } catch (error) {
    console.error('Error updating Google Calendar event:', error);
    throw new AppError(`Failed to update Google Calendar event: ${error.message}`, 500);
  }
};

// Delete event from Google Calendar
export const deleteCalendarEvent = async (googleEventId) => {
  try {
    const auth = await getAuthenticatedClient();
    const calendar = google.calendar({ version: 'v3', auth });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: googleEventId,
    });

    return true;
  } catch (error) {
    console.error('Error deleting Google Calendar event:', error);
    // Don't throw error if event doesn't exist
    if (error.code === 404) {
      return true;
    }
    throw new AppError(`Failed to delete Google Calendar event: ${error.message}`, 500);
  }
};

// Get connection status
export const getConnectionStatus = async () => {
  const configData = await googleCalendarRepo.getConfig();
  return {
    isConnected: configData.isConnected,
    connectedAt: configData.connectedAt,
    connectedBy: configData.connectedBy,
  };
};

// Disconnect Google Calendar
export const disconnectCalendar = async () => {
  await googleCalendarRepo.disconnect();
  return { success: true, message: 'Google Calendar disconnected successfully' };
};

