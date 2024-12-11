import { getEnv } from '@/common/utils/get-env';

const appConfig = () => ({
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  APP_ORIGIN: getEnv('APP_ORIGIN', 'localhost'),
  APP_URL: getEnv('APP_URL', 'http://localhost:5000'),
  PORT: getEnv('PORT', '5000'),
  BASE_PATH: getEnv('BASE_PATH', '/api/v1'),
  MONGO_URI: getEnv('MONGO_URI'),
  JWT: {
    SECRET: getEnv('JWT_SECRET'),
    EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '15m'),
    REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'),
    REFRESH_EXPIRES_IN: getEnv('JWT_REFRESH_EXPIRES_IN', '30d')
  },
  REDIS: {
    HOST: getEnv('REDIS_HOST', 'localhost'),
    PORT: getEnv('REDIS_PORT', '6379'),
    PASSWORD: getEnv('REDIS_PASSWORD')
  },

  SMTP: {
    SMTPHOST: getEnv('SMTPHOST'),
    SMTPPORT: getEnv('SMTPPORT'),
    SMTPUSER: getEnv('SMTPUSER'),
    SMTPPASS: getEnv('SMTPPASS')
  },

  storage: {
    STORAGE_TYPE: getEnv('STORAGE_TYPE', 'local'),
    CLOUDINARY_CLOUD_NAME: getEnv('CLOUDINARY_CLOUD_NAME'),
    CLOUDINARY_API_KEY: getEnv('CLOUDINARY_API_KEY'),
    CLOUDINARY_API_SECRET: getEnv('CLOUDINARY_API_SECRET')
  }
});

const config = appConfig();

export default config;
