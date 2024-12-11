import { FileStorageService, FileUploadOptions } from '@/@types/fileUpload.types';
import config from '@/config/app.config';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export class LocalStorageService implements FileStorageService {
  private uploadPath: string;

  constructor() {
    this.uploadPath = path.resolve('uploads');
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory() {
    try {
      await fs.mkdir(this.uploadPath, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory', error);
    }
  }

  async uploadFile(file: Express.Multer.File, options?: FileUploadOptions): Promise<string> {
    try {
      // Ensure upload directory exists
      await this.ensureUploadDirectory();

      // Generate unique filename
      const uniqueFileName = `${Date.now()}-${file.originalname}`;
      const fullPath = path.join(this.uploadPath, uniqueFileName);

      // If options are provided, resize the image
      if (options && (options.width || options.height)) {
        await sharp(file.buffer)
          .resize({
            width: options.width,
            height: options.height,
            fit: options.fit || 'cover'
          })
          .toFile(fullPath);
      } else {
        // Otherwise, save the original file
        await fs.writeFile(fullPath, file.buffer);
      }

      return uniqueFileName;
    } catch (error) {
      console.error('Local file upload failed', error);
      throw new Error('File upload failed');
    }
  }

  async getFileUrl(fileName: string, options?: FileUploadOptions): Promise<string> {
    try {
      const filePath = path.join(this.uploadPath, fileName);

      // If resize options are provided, create a resized version
      if (options && (options.width || options.height)) {
        const uniqueResizedName = `resized-${options.width}x${options.height}-${fileName}`;
        const resizedPath = path.join(this.uploadPath, uniqueResizedName);

        // Check if resized image already exists
        try {
          await fs.access(resizedPath);
          return uniqueResizedName;
        } catch {
          // Resized image doesn't exist, create it
          await sharp(filePath)
            .resize({
              width: options.width,
              height: options.height,
              fit: options.fit || 'cover'
            })
            .toFile(resizedPath);

          return uniqueResizedName;
        }
      }

      return config.APP_URL + '/uploads/' + fileName;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get file URL');
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadPath, fileName);
      await fs.unlink(filePath);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete file');
    }
  }
}
