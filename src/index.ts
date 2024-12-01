import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import config from '@config/app.config';
import connectDatabase from '@database/index';
import appRoutes from '@routes/appRoutes';
import chalk from 'chalk';

const app = express();
// const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.APP_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());

app.use('/', appRoutes);

app.listen(config.PORT, async () => {
  console.log(
    chalk.black.bgGreen(` Server listening on port ${config.PORT} in ${config.NODE_ENV}`)
  );
  await connectDatabase();
});
