import express from 'express';
import * as reminderController from './reminder.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as reminderSchema from './reminder.validation.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

// Protect all routes
router.use(authController.isAuth);

router
  .route('/')
  .get(authorize('reminders', 'read'), reminderController.getReminders)
  .post(
    authorize('reminders', 'create'),
    validation(reminderSchema.createReminderSchema),
    reminderController.createReminder
  );

router
  .route('/:id')
  .get(authorize('reminders', 'read'), reminderController.getReminder)
  .patch(
    authorize('reminders', 'update'),
    validation(reminderSchema.updateReminderSchema),
    reminderController.updateReminder
  )
  .delete(authorize('reminders', 'delete'), reminderController.deleteReminder);

export default router;






