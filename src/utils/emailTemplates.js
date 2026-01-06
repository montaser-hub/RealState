import { config } from '../configs/env.js';

/**
 * Base professional email template styles
 */
const getBaseStyles = () => `
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
  .info-box { 
    background-color: #f7fafc; 
    border-left: 4px solid #667eea; 
    padding: 20px; 
    margin: 30px 0;
    border-radius: 4px;
  }
  .warning-box { 
    background-color: #fef3c7; 
    border-left: 4px solid #f59e0b; 
    padding: 20px; 
    margin: 30px 0;
    border-radius: 4px;
  }
  .success-box { 
    background-color: #d1fae5; 
    border-left: 4px solid #10b981; 
    padding: 20px; 
    margin: 30px 0;
    border-radius: 4px;
  }
  .details-list {
    list-style: none;
    padding: 0;
    margin: 15px 0;
  }
  .details-list li {
    padding: 10px 0;
    border-bottom: 1px solid #e2e8f0;
    font-size: 14px;
    color: #4a5568;
  }
  .details-list li:last-child {
    border-bottom: none;
  }
  .details-list strong {
    color: #2d3748;
    display: inline-block;
    min-width: 140px;
  }
  .button-container {
    text-align: center;
    margin: 35px 0;
  }
  .button { 
    display: inline-block; 
    padding: 16px 40px; 
    color: #ffffff !important; 
    text-decoration: none; 
    border-radius: 8px; 
    font-weight: 600;
    font-size: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s;
  }
  .button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
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
`;

/**
 * Birthday wish email template
 */
export const getBirthdayWishTemplate = (ownerName, propertyCount = 0) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${getBaseStyles()}
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        .button { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <h1>🎉 Happy Birthday!</h1>
        </div>
        <div class="content">
          <p class="greeting">Dear ${ownerName},</p>
          <p class="message">
            We want to wish you a very <strong>Happy Birthday</strong>! 🎂
          </p>
          <p class="message">
            Thank you for being a valued property owner with RealState Management. Your trust in us means the world!
          </p>
          ${propertyCount > 0 ? `
          <div class="success-box">
            <p><strong>📊 Your Properties:</strong></p>
            <p>You currently have <strong>${propertyCount}</strong> property${propertyCount > 1 ? 'ies' : ''} in our system.</p>
          </div>
          ` : ''}
          <div class="success-box">
            <p><strong>✨ We appreciate your trust in us!</strong></p>
            <p>May this year bring you success, happiness, and prosperity in all your real estate endeavors.</p>
          </div>
          <p class="message">
            Best regards,<br><strong>RealState Management Team</strong>
          </p>
        </div>
        <div class="footer">
          <p>This is an automated email from RealState Management.</p>
          <p>Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} RealState Management. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Contract expiry reminder email template
 */
export const getContractExpiryTemplate = (ownerName, contractNumber, endDate, propertyAddress, daysUntilExpiry) => {
  const expiryDate = new Date(endDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${getBaseStyles()}
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
        .button { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <h1>⏰ Contract Expiry Reminder</h1>
        </div>
        <div class="content">
          <p class="greeting">Dear ${ownerName},</p>
          <p class="message">
            This is a reminder that your contract is expiring soon. We want to ensure a smooth transition and help you plan ahead.
          </p>
          <div class="warning-box">
            <p><strong>📋 Contract Details:</strong></p>
            <ul class="details-list">
              <li><strong>Contract Number:</strong> ${contractNumber}</li>
              <li><strong>Property Address:</strong> ${propertyAddress}</li>
              <li><strong>Expiry Date:</strong> ${expiryDate}</li>
              <li><strong>Days Remaining:</strong> <span style="color: #d97706; font-weight: 600;">${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}</span></li>
            </ul>
          </div>
          <div class="info-box">
            <p><strong>📞 Action Required:</strong></p>
            <p>We recommend reaching out to our team at least ${daysUntilExpiry > 30 ? '30 days' : '7 days'} before the expiry date to discuss contract renewal or termination options and ensure a smooth transition.</p>
          </div>
          <p class="message">
            If you have any questions or need assistance, please don't hesitate to contact us.
          </p>
          <p class="message">
            Best regards,<br><strong>RealState Management Team</strong>
          </p>
        </div>
        <div class="footer">
          <p>This is an automated email from RealState Management.</p>
          <p>Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} RealState Management. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Property notification email template
 */
export const getPropertyNotificationTemplate = (recipientName, propertyTitle, propertyReference, action = 'updated') => {
  const actionMessages = {
    created: 'A new property has been added to your account',
    updated: 'A property in your account has been updated',
    deleted: 'A property has been removed from your account',
    status: 'The status of a property has changed'
  };

  const actionIcons = {
    created: '✨',
    updated: '📝',
    deleted: '🗑️',
    status: '🔄'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${getBaseStyles()}
        .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
        .button { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <h1>${actionIcons[action] || '📝'} Property ${action.charAt(0).toUpperCase() + action.slice(1)}</h1>
        </div>
        <div class="content">
          <p class="greeting">Dear ${recipientName},</p>
          <p class="message">
            ${actionMessages[action] || 'A property in your account has been modified'}.
          </p>
          <div class="info-box">
            <p><strong>🏠 Property Details:</strong></p>
            <ul class="details-list">
              <li><strong>Title:</strong> ${propertyTitle}</li>
              <li><strong>Reference ID:</strong> ${propertyReference}</li>
            </ul>
          </div>
          <p class="message">
            You can view and manage this property in your dashboard at any time.
          </p>
          <div class="button-container">
            <a href="${config.productionUrl || 'http://localhost:3001'}/properties" class="button">View Properties</a>
          </div>
          <p class="message">
            Best regards,<br><strong>RealState Management Team</strong>
          </p>
        </div>
        <div class="footer">
          <p>This is an automated email from RealState Management.</p>
          <p>Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} RealState Management. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Payment reminder email template
 */
export const getPaymentReminderTemplate = (ownerName, amount, currency, dueDate, propertyReference) => {
  const formattedDate = new Date(dueDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${getBaseStyles()}
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
        .button { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <h1>💳 Payment Reminder</h1>
        </div>
        <div class="content">
          <p class="greeting">Dear ${ownerName},</p>
          <p class="message">
            This is a friendly reminder about an upcoming payment that requires your attention.
          </p>
          <div class="warning-box">
            <p><strong>💰 Payment Details:</strong></p>
            <ul class="details-list">
              <li><strong>Amount:</strong> <span style="color: #dc2626; font-weight: 600; font-size: 16px;">${amount} ${currency}</span></li>
              <li><strong>Due Date:</strong> ${formattedDate}</li>
              ${propertyReference ? `<li><strong>Property Reference:</strong> ${propertyReference}</li>` : ''}
            </ul>
          </div>
          <div class="info-box">
            <p><strong>⏰ Important:</strong></p>
            <p>Please ensure payment is made before the due date to avoid any late fees or service interruptions.</p>
          </div>
          <p class="message">
            If you have already made the payment, please disregard this email. If you have any questions or need assistance, feel free to contact us.
          </p>
          <p class="message">
            Best regards,<br><strong>RealState Management Team</strong>
          </p>
        </div>
        <div class="footer">
          <p>This is an automated email from RealState Management.</p>
          <p>Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} RealState Management. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Contract created notification email template
 */
export const getContractCreatedTemplate = (ownerName, contractNumber, startDate, endDate, amount, currency) => {
  const start = new Date(startDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const end = new Date(endDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${getBaseStyles()}
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .button { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <h1>✅ New Contract Created</h1>
        </div>
        <div class="content">
          <p class="greeting">Dear ${ownerName},</p>
          <p class="message">
            Great news! A new contract has been created and is now active in your account.
          </p>
          <div class="success-box">
            <p><strong>📄 Contract Details:</strong></p>
            <ul class="details-list">
              <li><strong>Contract Number:</strong> ${contractNumber}</li>
              <li><strong>Start Date:</strong> ${start}</li>
              <li><strong>End Date:</strong> ${end}</li>
              <li><strong>Amount:</strong> <span style="color: #059669; font-weight: 600;">${amount} ${currency}</span></li>
            </ul>
          </div>
          <p class="message">
            You can view the complete contract details and manage it from your dashboard.
          </p>
          <div class="button-container">
            <a href="${config.productionUrl || 'http://localhost:3001'}/contracts" class="button">View Contracts</a>
          </div>
          <p class="message">
            If you have any questions about this contract, please don't hesitate to reach out to us.
          </p>
          <p class="message">
            Best regards,<br><strong>RealState Management Team</strong>
          </p>
        </div>
        <div class="footer">
          <p>This is an automated email from RealState Management.</p>
          <p>Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} RealState Management. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
