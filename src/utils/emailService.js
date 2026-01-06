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
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
              line-height: 1.6; 
              color: #333333; 
              background-color: #f5f7fa;
              padding: 20px;
            }
            .email-wrapper { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: #ffffff; 
              padding: 40px 30px; 
              text-align: center;
            }
            .header h1 {
              font-size: 28px;
              font-weight: 600;
              margin: 0;
              letter-spacing: -0.5px;
            }
            .content { 
              padding: 40px 30px; 
              background-color: #ffffff;
            }
            .greeting {
              font-size: 18px;
              color: #1a1a1a;
              margin-bottom: 20px;
              font-weight: 500;
            }
            .message {
              font-size: 16px;
              color: #4a5568;
              margin-bottom: 30px;
              line-height: 1.7;
            }
            .credentials-box {
              background-color: #f7fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
            }
            .credentials-box p {
              margin: 8px 0;
              font-size: 14px;
              color: #4a5568;
            }
            .credentials-box strong {
              color: #2d3748;
              display: inline-block;
              min-width: 120px;
            }
            .password-warning {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .password-warning p {
              margin: 5px 0;
              font-size: 14px;
              color: #92400e;
            }
            .button-container {
              text-align: center;
              margin: 35px 0;
            }
            .button { 
              display: inline-block; 
              padding: 16px 40px; 
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: #ffffff !important; 
              text-decoration: none; 
              border-radius: 8px; 
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
              transition: transform 0.2s;
            }
            .button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(16, 185, 129, 0.5);
            }
            .footer { 
              text-align: center; 
              padding: 30px; 
              background-color: #f7fafc;
              color: #718096; 
              font-size: 13px;
              border-top: 1px solid #e2e8f0;
            }
            .footer p {
              margin: 5px 0;
            }
            @media only screen and (max-width: 600px) {
              .content { padding: 30px 20px; }
              .header { padding: 30px 20px; }
              .header h1 { font-size: 24px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <h1>🎉 Welcome to RealState Management!</h1>
            </div>
            <div class="content">
              <p class="greeting">Hello ${user.firstName} ${user.lastName},</p>
              <p class="message">
                We're thrilled to have you on board! Your account has been successfully created and you're all set to start managing your real estate properties.
              </p>
              <div class="credentials-box">
                <p><strong>Account Email:</strong> ${user.email}</p>
                ${user.nickname ? `<p><strong>Nickname:</strong> ${user.nickname}</p>` : ''}
                ${password ? `<p><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${password}</code></p>` : ''}
              </div>
              ${password ? `
              <div class="password-warning">
                <p><strong>🔒 Security Notice:</strong> Please change your temporary password after logging in for security purposes.</p>
              </div>
              ` : ''}
              <p class="message">
                You can now log in to your account and start exploring all the features we have to offer.
              </p>
              <div class="button-container">
                <a href="${config.productionUrl || 'http://localhost:3001'}/login" class="button">Login to Your Account</a>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated email from RealState Management.</p>
              <p>Please do not reply to this email.</p>
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
    const emailData = {
      from: `${config.resend.fromName} <${config.resend.fromEmail}>`,
      to: user.email,
      subject: 'Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
              line-height: 1.6; 
              color: #333333; 
              background-color: #f5f7fa;
              padding: 20px;
            }
            .email-wrapper { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #ffffff; 
              padding: 40px 30px; 
              text-align: center;
            }
            .header h1 {
              font-size: 28px;
              font-weight: 600;
              margin: 0;
              letter-spacing: -0.5px;
            }
            .content { 
              padding: 40px 30px; 
              background-color: #ffffff;
            }
            .greeting {
              font-size: 18px;
              color: #1a1a1a;
              margin-bottom: 20px;
              font-weight: 500;
            }
            .message {
              font-size: 16px;
              color: #4a5568;
              margin-bottom: 30px;
              line-height: 1.7;
            }
            .button-container {
              text-align: center;
              margin: 35px 0;
            }
            .button { 
              display: inline-block; 
              padding: 16px 40px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #ffffff !important; 
              text-decoration: none; 
              border-radius: 8px; 
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
              transition: transform 0.2s;
            }
            .button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
            }
            .info-box { 
              background-color: #f7fafc; 
              border-left: 4px solid #667eea; 
              padding: 20px; 
              margin: 30px 0;
              border-radius: 4px;
            }
            .info-box p {
              margin: 8px 0;
              font-size: 14px;
              color: #4a5568;
            }
            .info-box strong {
              color: #2d3748;
            }
            .link-section {
              margin-top: 30px;
              padding-top: 30px;
              border-top: 1px solid #e2e8f0;
            }
            .link-section p {
              font-size: 14px;
              color: #718096;
              margin-bottom: 10px;
            }
            .link-url {
              word-break: break-all; 
              color: #667eea;
              font-size: 13px;
              font-family: 'Courier New', monospace;
              background-color: #f7fafc;
              padding: 12px;
              border-radius: 6px;
              border: 1px solid #e2e8f0;
            }
            .footer { 
              text-align: center; 
              padding: 30px; 
              background-color: #f7fafc;
              color: #718096; 
              font-size: 13px;
              border-top: 1px solid #e2e8f0;
            }
            .footer p {
              margin: 5px 0;
            }
            @media only screen and (max-width: 600px) {
              .content { padding: 30px 20px; }
              .header { padding: 30px 20px; }
              .header h1 { font-size: 24px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <p class="greeting">Hello ${user.firstName} ${user.lastName},</p>
              <p class="message">
                We received a request to reset your password for your RealState Management account. 
                If you made this request, click the button below to create a new password.
              </p>
              <div class="button-container">
                <a href="${resetUrl}" class="button">Reset My Password</a>
              </div>
              <div class="info-box">
                <p><strong>⏰ Security Notice:</strong> This reset link will expire in 10 minutes for your security.</p>
                <p><strong>🔒 Didn't request this?</strong> If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              </div>
              <div class="link-section">
                <p><strong>Having trouble with the button?</strong> Copy and paste this link into your browser:</p>
                <p class="link-url">${resetUrl}</p>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated email from RealState Management.</p>
              <p>Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
    console.log('Sending email:', { to: emailData.to, subject: emailData.subject, from: emailData.from });
    const { data, error } = await resend.emails.send(emailData);

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

// Export email templates for use in other modules
export {
  getBirthdayWishTemplate,
  getContractExpiryTemplate,
  getPropertyNotificationTemplate,
  getPaymentReminderTemplate,
  getContractCreatedTemplate
} from './emailTemplates.js';

