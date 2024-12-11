import { UploadApiOptions } from './../../node_modules/cloudinary/types/index.d';
import { FileStorageService, FileUploadOptions } from '@/@types/fileUpload.types';
import config from '@/config/app.config';
import { v2 as cloudinary } from 'cloudinary';

export class CloudinaryStorageService implements FileStorageService {
  constructor() {
    cloudinary.config({
      cloud_name: config.storage.CLOUDINARY_CLOUD_NAME,
      api_key: config.storage.CLOUDINARY_API_KEY,
      api_secret: config.storage.CLOUDINARY_API_SECRET
    });
  }

  async uploadFile(file: Express.Multer.File, options?: FileUploadOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      // Prepare upload options
      const uploadOptions: UploadApiOptions = {
        folder: 'uploads'
      };

      // Add resizing if options are provided
      if (options && (options.width || options.height)) {
        uploadOptions.transformation = [
          {
            width: options.width,
            height: options.height,
            crop: this.mapCropMode(options.fit)
          }
        ];
      }

      // Upload stream
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result?.public_id || '');
      });

      // Write file buffer to upload stream
      uploadStream.end(file.buffer);
    });
  }

  async getFileUrl(fileName: string, options?: FileUploadOptions): Promise<string> {
    // Cloudinary allows dynamic transformations in the URL
    const baseUrl = cloudinary.url(fileName, {
      type: 'upload',
      // Apply transformation if options are provided
      ...(options && (options.width || options.height)
        ? {
            transformation: [
              {
                width: options.width,
                height: options.height,
                crop: this.mapCropMode(options.fit)
              }
            ]
          }
        : {})
    });

    return baseUrl;
  }

  async deleteFile(public_id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(public_id, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  // Helper method to map our fit options to Cloudinary's crop modes
  private mapCropMode(fit?: FileUploadOptions['fit']): string {
    switch (fit) {
      case 'cover':
        return 'crop';
      case 'contain':
        return 'scale';
      case 'fill':
        return 'fill';
      case 'inside':
        return 'fit';
      case 'outside':
        return 'limit';
      default:
        return 'crop';
    }
  }
}
