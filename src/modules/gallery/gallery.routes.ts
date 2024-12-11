import { Router } from 'express';
import { GalleryController } from './gallery.controller';
import { uploadMultipleFiles } from '@/middlewares/fileUpload';
import validate from '@/middlewares/validate';
import { createFolder, uploadImageToGallery } from './gallery.validation';

const router = Router();

router.get('/all', GalleryController.getAllImages);
router.get('/folder/:folder/images', GalleryController.getImagesByFolder);

router.post(
  '/upload',
  uploadMultipleFiles,
  validate(uploadImageToGallery),
  GalleryController.createImage
);

router.post('/upload/attachment', GalleryController.createAttachment);

router.get('/folders', GalleryController.getFolders);

router.post('/folder', validate(createFolder), GalleryController.createFolder);

router.delete('/images', GalleryController.deleteBatchImages);
router.delete('/image/:id', GalleryController.deleteImage);
router.delete('/folder/:id', GalleryController.deleteFolder);

export default router;
