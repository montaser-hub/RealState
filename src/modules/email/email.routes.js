import express from 'express';
import * as emailController from './email.controller.js';
import * as authController from '../auth/Auth.controller.js';
import validation from '../../middlewares/validation.js';
import * as emailSchema from './email.validation.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

// Protect all routes
router.use(authController.isAuth);

// Send custom email to email address(es)
router.post(
  '/send',
  authorize('users', 'update'), // Admin/Manager can send emails
  validation(emailSchema.sendCustomEmailSchema),
  emailController.sendCustomEmailToUser
);

// Send custom email to user by identifier (email, nickname, or ID)
router.post(
  '/send/:identifier',
  authorize('users', 'update'), // Admin/Manager can send emails
  validation(emailSchema.sendCustomEmailByIdentifierSchema),
  emailController.sendCustomEmailByIdentifier
);

export default router;



