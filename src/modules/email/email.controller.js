import catchAsync from '../../middlewares/ctachAsync.js';
import { sendCustomEmail } from '../../utils/emailService.js';
import AppError from '../../utils/appError.js';
import * as userRepo from '../user/user.repository.js';

export const sendCustomEmailToUser = catchAsync(async (req, res, next) => {
  const { to, subject, html, text } = req.body;

  if (!to || !subject || !html) {
    return next(new AppError('to, subject, and html are required', 400));
  }

  // Validate email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const recipients = Array.isArray(to) ? to : [to];
  
  for (const email of recipients) {
    if (!emailRegex.test(email)) {
      return next(new AppError(`Invalid email address: ${email}`, 400));
    }
  }

  const result = await sendCustomEmail(recipients, subject, html, text);

  res.status(200).json({
    status: 'success',
    message: 'Email sent successfully',
    data: result,
  });
});

export const sendCustomEmailByIdentifier = catchAsync(async (req, res, next) => {
  const { identifier } = req.params; // email, nickname, or user ID
  const { subject, html, text } = req.body;

  if (!subject || !html) {
    return next(new AppError('subject and html are required', 400));
  }

  // Find user by identifier (email, nickname, or ID)
  const user = await userRepo.findByIdentifier(identifier);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const result = await sendCustomEmail(user.email, subject, html, text);

  res.status(200).json({
    status: 'success',
    message: `Email sent successfully to ${user.email}`,
    data: result,
  });
});



