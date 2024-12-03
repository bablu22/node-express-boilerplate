import * as path from 'path';
import ejs from 'ejs';
import ErrorCode from '@common/enums/error-code.enums';
import { AppError } from './AppError';

export const renderEjs = async (fileName: string, payload: any) => {
  try {
    const filePath = path.join(__dirname, `../../templates/${fileName}.ejs`);
    const html = await new Promise<string>((resolve, reject) => {
      ejs.renderFile(filePath, payload, (err: any, str: string | PromiseLike<string>) => {
        if (err) {
          reject(err);
        }
        resolve(str);
      });
    });

    return html;
  } catch (error: any) {
    throw new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      error.message || 'Something went wrong while rendering ejs file'
    );
  }
};
