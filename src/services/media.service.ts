import { Request } from 'express';
import { FileUploadService } from './fileUpload.service';
import { FileUploadOptions } from '@/@types/fileUpload.types';
import { AppError } from '@/common/utils/AppError';

export class Media {
  private fileUploadService: FileUploadService;

  constructor() {
    this.fileUploadService = new FileUploadService();
  }

  uploadFile = async (
    files: Express.Multer.File | Express.Multer.File[],
    req: Request
  ): Promise<{ fileName: string; fileUrl: string } | { fileName: string; fileUrl: string }[]> => {
    try {
      if (!files || (Array.isArray(files) && files.length === 0)) {
        throw new AppError('No files uploaded', 400);
      }

      // Parse resize options from query parameters
      const resizeOptions: FileUploadOptions = {
        width: req.query.width ? parseInt(req.query.width as string) : undefined,
        height: req.query.height ? parseInt(req.query.height as string) : undefined,
        fit: req.query.fit as FileUploadOptions['fit']
      };

      const processFile = async (file: Express.Multer.File) => {
        // Upload file with optional resize options
        const fileName = await this.fileUploadService.uploadFile(file, resizeOptions);

        // Get the URL of the uploaded file
        const fileUrl = await this.fileUploadService.getFileUrl(fileName, resizeOptions);

        return { fileName, fileUrl };
      };
      if (Array.isArray(files)) {
        // Process multiple files
        const uploadResults = await Promise.all(files.map((file) => processFile(file)));
        return uploadResults;
      } else {
        // Process single file
        const result = await processFile(files);
        return result;
      }
    } catch (error) {
      console.error('File upload error:', error);
      throw new AppError('File upload failed', 500);
    }
  };

  getFile = async (req: Request) => {
    try {
      const { fileName } = req.params;

      // Parse resize options from query parameters
      const resizeOptions: FileUploadOptions = {
        width: req.query.width ? parseInt(req.query.width as string) : undefined,
        height: req.query.height ? parseInt(req.query.height as string) : undefined,
        fit: req.query.fit as FileUploadOptions['fit']
      };

      // Get the file URL with optional resize options
      const fileUrl = await this.fileUploadService.getFileUrl(fileName, resizeOptions);

      return fileUrl;
    } catch (error: any) {
      throw new AppError(error.message || 'File retrieval failed', 500);
    }
  };

  deleteFile = async (fileName: string) => {
    try {
      await this.fileUploadService.deleteFile(fileName);

      return 'File deleted successfully';
    } catch (error: any) {
      throw new AppError(error.message || 'File deletion failed', 500);
    }
  };
}
