import express from 'express';
import * as googleCalendarController from './googleCalendar.controller.js';
import * as authController from '../auth/Auth.controller.js';

const router = express.Router();

// Get OAuth URL (Admin only) - requires auth
router.get('/connect', authController.isAuth, googleCalendarController.getAuthUrl);

// OAuth callback - NO auth required (Google redirects here)
router.get('/connect/callback', googleCalendarController.handleCallback);

// All other routes require authentication
router.use(authController.isAuth);

// Get connection status
router.get('/status', googleCalendarController.getConnectionStatus);

// Disconnect (Admin only)
router.delete('/disconnect', googleCalendarController.disconnectCalendar);

export default router;

