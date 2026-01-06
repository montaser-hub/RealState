import catchAsync from '../../middlewares/ctachAsync.js';
import * as googleCalendarService from './googleCalendar.service.js';
import AppError from '../../utils/appError.js';

// Get OAuth URL (Admin only)
export const getAuthUrl = catchAsync(async (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Only admin can connect Google Calendar', 403));
  }

  const userId = req.user?._id || req.user?.id;
  const authUrl = googleCalendarService.getAuthUrl(userId);
  res.status(200).json({
    status: 'success',
    data: {
      authUrl,
    },
  });
});

// Handle OAuth callback
export const handleCallback = catchAsync(async (req, res, next) => {
  const { code, state, error, error_description } = req.query;

  // Handle OAuth errors
  if (error) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const errorDesc = encodeURIComponent(error_description || 'Authentication failed');
    return res.redirect(`${frontendUrl}/dashboard/reminder?error=${error}&error_description=${errorDesc}`);
  }

  if (!code) {
    return next(new AppError('Authorization code is required', 400));
  }

  try {
    await googleCalendarService.handleCallback(code, state);

    // Redirect to frontend success page
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    res.redirect(`${frontendUrl}/dashboard/reminder?google-calendar=connected`);
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const errorDesc = encodeURIComponent(error.message || 'Connection failed');
    res.redirect(`${frontendUrl}/dashboard/reminder?error=connection_failed&error_description=${errorDesc}`);
  }
});

// Get connection status
export const getConnectionStatus = catchAsync(async (req, res, next) => {
  const status = await googleCalendarService.getConnectionStatus();
  res.status(200).json({
    status: 'success',
    data: status,
  });
});

// Disconnect Google Calendar (Admin only)
export const disconnectCalendar = catchAsync(async (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Only admin can disconnect Google Calendar', 403));
  }

  await googleCalendarService.disconnectCalendar();
  res.status(200).json({
    status: 'success',
    message: 'Google Calendar disconnected successfully',
  });
});

