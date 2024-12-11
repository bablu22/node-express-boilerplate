import { LocalStorageService } from './localStorage.service';
import { CloudinaryStorageService } from './cloudinary.service';
import { FileStorageService, FileUploadOptions, StorageType } from '@/@types/fileUpload.types';
import config from '@/config/app.config';

export class FileUploadService {
  private storageService: FileStorageService;

  constructor(storageType?: StorageType) {
    const type = storageType || (config.storage.STORAGE_TYPE as StorageType);

    this.storageService =
      type === 'cloudinary' ? new CloudinaryStorageService() : new LocalStorageService();
  }

  async uploadFile(file: Express.Multer.File, options?: FileUploadOptions): Promise<string> {
    return this.storageService.uploadFile(file, options);
  }

  async getFileUrl(fileName: string, options?: FileUploadOptions): Promise<string> {
    return this.storageService.getFileUrl(fileName, options);
  }

  async deleteFile(fileName: string): Promise<void> {
    return this.storageService.deleteFile(fileName);
  }
}
