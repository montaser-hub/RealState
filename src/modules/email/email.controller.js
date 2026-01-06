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

/**
 * Test email endpoint - sends a test email to verify email configuration
 */
export const testEmail = catchAsync(async (req, res, next) => {
  const { to } = req.body;
  
  if (!to) {
    return next(new AppError('Email address (to) is required', 400));
  }

  // Validate email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    return next(new AppError('Invalid email address', 400));
  }

  const testHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 30px 20px; background-color: #f9f9f9; }
        .success-box { background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Email Test Successful!</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>This is a test email from <strong>RealState Management</strong>.</p>
          <div class="success-box">
            <p><strong>Your email configuration is working correctly!</strong></p>
            <p>If you received this email, it means:</p>
            <ul>
              <li>✅ Resend API is connected</li>
              <li>✅ Domain is verified</li>
              <li>✅ Email service is operational</li>
            </ul>
          </div>
          <p><strong>Test Details:</strong></p>
          <ul>
            <li><strong>Sent to:</strong> ${to}</li>
            <li><strong>Sent at:</strong> ${new Date().toLocaleString()}</li>
            <li><strong>Server:</strong> RealState Management API</li>
          </ul>
          <p>You can now use the email service for:</p>
          <ul>
            <li>Welcome emails</li>
            <li>Password resets</li>
            <li>Contract notifications</li>
            <li>Birthday wishes</li>
            <li>And more!</li>
          </ul>
          <p>Best regards,<br><strong>RealState Management Team</strong></p>
        </div>
        <div class="footer">
          <p>This is a test email. Please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} RealState Management. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const result = await sendCustomEmail(
    to,
    '✅ RealState Email Test - Configuration Successful',
    testHtml
  );

  res.status(200).json({
    status: 'success',
    message: `Test email sent successfully to ${to}`,
    data: result,
  });
});




