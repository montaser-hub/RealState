import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

dotenv.config({
  path: path.resolve(process.cwd(), `${envFile}`)
});

export const config = {
  productionUrl: process.env.PRODUCTION_URL,
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  dbUri: process.env.DB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  cookieExpiresIn: Number(process.env.JWT_COOKIE_EXPIRES_IN) *
    24 *
    60 *
    60 *
    1000,
  // Backblaze B2 Configuration
  b2: {
    applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
    applicationKey: process.env.B2_APPLICATION_KEY,
    bucketName: process.env.B2_BUCKET_NAME,
    bucketId: process.env.B2_BUCKET_ID,
    endpoint: process.env.B2_ENDPOINT,
    region: process.env.B2_REGION,
    signedUrlExpiry: Number(process.env.B2_SIGNED_URL_EXPIRY) || 3600, // Default: 1 hour
  },
  // Google Calendar Configuration
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/v1/google/connect/callback',
    scopes: [process.env.GOOGLE_SCOPES || 'https://www.googleapis.com/auth/calendar'],
  },
  // Resend Email Configuration
  resend: {
    apiKey: process.env.RESEND_API_KEY || process.env.RESNED_API_KEY, // Support both correct and typo
    fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    fromName: process.env.RESEND_FROM_NAME || 'RealState Management',
  },
};
