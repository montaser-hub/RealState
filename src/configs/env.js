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
};
