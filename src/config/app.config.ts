import { getEnv } from '@/common/utils/get-env';

const appConfig = () => ({
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  APP_ORIGIN: getEnv('APP_ORIGIN', 'localhost'),
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
  }
});

const config = appConfig();

export default config;
