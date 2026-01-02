import { Resend } from 'resend';
import { config } from '../configs/env.js';

if (!config.resend.apiKey) {
  console.warn('Warning: RESEND_API_KEY is not set. Email functionality will not work.');
}

const resend = config.resend.apiKey ? new Resend(config.resend.apiKey) : null;

/**
 * Send welcome email to new user
 */
export const sendWelcomeEmail = async (user, password = null) => {
  if (!resend) {
    throw new Error('Resend API key is not configured');
  }
  try {
    const { data, error } = await resend.emails.send({
      from: `${config.resend.fromName} <${config.resend.fromEmail}>`,
      to: user.email,
      subject: 'Welcome to RealState Management',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to RealState Management!</h1>
            </div>
            <div class="content">
              <p>Hello ${user.firstName} ${user.lastName},</p>
              <p>Your account has been successfully created!</p>
              <p><strong>Email:</strong> ${user.email}</p>
              ${user.nickname ? `<p><strong>Nickname:</strong> ${user.nickname}</p>` : ''}
              ${password ? `<p><strong>Temporary Password:</strong> ${password}</p><p>Please change your password after logging in.</p>` : ''}
              <p>You can now log in to your account and start managing your real estate properties.</p>
              <a href="${config.productionUrl || 'http://localhost:3001'}/login" class="button">Login to Your Account</a>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (user, resetUrl) => {
  if (!resend) {
    throw new Error('Resend API key is not configured');
  }
  try {
    const { data, error } = await resend.emails.send({
      from: `${config.resend.fromName} <${config.resend.fromEmail}>`,
      to: user.email,
      subject: 'Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 10px 20px; background-color: #f44336; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${user.firstName} ${user.lastName},</p>
              <p>You requested to reset your password. Click the button below to reset it:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <div class="warning">
                <p><strong>Important:</strong> This link will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Send custom email
 */
export const sendCustomEmail = async (to, subject, html, text = null) => {
  if (!resend) {
    throw new Error('Resend API key is not configured');
  }
  try {
    const emailData = {
      from: `${config.resend.fromName} <${config.resend.fromEmail}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    };

    if (text) {
      emailData.text = text;
    }

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error sending custom email:', error);
    throw error;
  }
};

