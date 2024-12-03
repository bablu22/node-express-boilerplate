import 'module-alias/register';
import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import config from '@config/app.config';
import connectDatabase from '@database/index';
import appRoutes from '@routes/appRoutes';
import chalk from 'chalk';
import { validateRedisConnection } from './config/redis.config';
import router from '@routes/index';
import notFound from '@middlewares/404';
import { errorHandler } from '@middlewares/errorHandler';
import { logger } from '@common/utils/logger';
import passport from '@middlewares/passport';

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(
  cors({
    origin: config.APP_ORIGIN,
    credentials: true,
  })
);

app.use('/', appRoutes);
app.use(`${BASE_PATH}/`, router);

// Middlewares
app.use(notFound);
app.use(errorHandler);
app.use((req, res, next) => {
  logger.info(`[Global] Incoming request: ${req.method} ${req.url}`);
  next();
});

app.listen(config.PORT, async () => {
  console.log(' ');
  console.log(
    chalk.black.bgWhite(` Server listening on port ${config.PORT} in ${config.NODE_ENV} mode ✅ `)
  );
  console.log(' ');
  await connectDatabase();
  console.log(' ');
  await validateRedisConnection();
});
