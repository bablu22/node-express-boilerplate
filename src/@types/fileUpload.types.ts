export interface FileUploadOptions {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export type StorageType = 'local' | 'cloudinary';

export interface FileStorageService {
  uploadFile(file: Express.Multer.File, options?: FileUploadOptions): Promise<string>;
  getFileUrl(fileName: string, options?: FileUploadOptions): Promise<string>;
  deleteFile(fileName: string): Promise<void>;
}
