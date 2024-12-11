import { Request } from 'express';
import httpStatus from 'http-status';
import { TMeta } from '@/common/utils/sendResponse';
import { IFolder, IGallery } from './gallery.interface';
import { Folder, Gallery } from './gallery.model';
import QueryBuilder from '@/database/Query';
import { AppError } from '@/common/utils/AppError';
import { Media } from '@/services/media.service';
import { extractPublicId } from 'cloudinary-build-url';
import { v4 as uuid } from 'uuid';

const media = new Media();

const getAllImages = async (
  query: Record<string, unknown>
): Promise<{ meta: TMeta; result: IGallery[] }> => {
  const ResourceSearchableFields: (keyof IGallery)[] = [];

  const queryBuilder = new QueryBuilder<IGallery>(Gallery, {
    ...query,
    populate: {
      path: 'folder',
      select: 'name'
    }
  });

  const result = await queryBuilder.search(ResourceSearchableFields).paginate().execute();

  return {
    meta: result.meta,
    result: result.data
  };
};

const getImagesByFolder = async (req: Request) => {
  const { folder } = req.params;
  const ResourceSearchableFields: (keyof IGallery)[] = [];

  const queryBuilder = new QueryBuilder<IGallery>(Gallery, {
    ...req.query,
    filter: { folder },
    populate: { path: 'folder', select: 'name' }
  });

  const result = await queryBuilder.search(ResourceSearchableFields).paginate().execute();

  return {
    meta: result.meta,
    result: result.data
  };
};

const createImage = async (req: Request) => {
  try {
    // Validate inputs
    const files = req.files as Express.Multer.File[];
    const { folder } = req.body;

    if (!files || files.length === 0) {
      throw new AppError('No files uploaded', httpStatus.BAD_REQUEST);
    }

    const folderDoc = await Folder.findById(folder);
    if (!folderDoc) {
      throw new AppError("The folder doesn't exist", httpStatus.NOT_FOUND);
    }

    // Upload files and prepare data for insertion
    const uploadResults = await media.uploadFile(files, req);

    const formattedData = (Array.isArray(uploadResults) ? uploadResults : [uploadResults]).map(
      (image: { fileName: string; fileUrl: string }) => ({
        public_id: image.fileName.includes('cloudinary') ? extractPublicId(image.fileName) : uuid(),
        url: image.fileUrl,
        folder: folderDoc._id
      })
    );

    // Insert all images into the gallery
    await Gallery.insertMany(formattedData);

    return 'Images uploaded successfully';
  } catch (error: any) {
    console.error('Error during image upload:', error);
    throw new AppError(
      error.message || 'Image upload failed',
      error.statusCode || httpStatus.BAD_REQUEST
    );
  }
};

const deleteImage = async (req: Request) => {
  const { id } = req.params;

  // Find the image in the database
  const image = await Gallery.findById(id);

  // Throw an error if image is not found
  if (!image) {
    throw new AppError('Image not found', httpStatus.NOT_FOUND);
  }

  try {
    if (image.url.includes('cloudinary')) {
      // Extract public ID for Cloudinary
      const publicId = extractPublicId(image.url);
      await media.deleteFile(publicId);
    } else {
      // Local file deletion
      const fileName = image.url.split('/uploads/').pop();
      await media.deleteFile(fileName as string);
    }

    // Remove the image record from the database
    await Gallery.findByIdAndDelete(id);

    return 'Image deleted successfully';
  } catch (error: any) {
    throw new AppError(`Error deleting image: ${error.message}`, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

const getFolders = async (
  query: Record<string, unknown>
): Promise<{ meta: TMeta; result: IFolder[] }> => {
  const ResourceSearchableFields: (keyof IFolder)[] = ['name'];

  const queryBuilder = new QueryBuilder<IFolder>(Folder, {
    ...query,
    populate: {
      path: 'images'
    }
  });

  const result = await queryBuilder.search(ResourceSearchableFields).paginate().execute();

  return {
    meta: result.meta,
    result: result.data
  };
};

// Function to create a folder
const createFolder = async (req: Request) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new AppError("Folder name can't be empty", httpStatus.BAD_REQUEST);
    }

    const folder = await Folder.createFolder(name);
    return folder;
  } catch (error: any) {
    throw new AppError(error.message, httpStatus.BAD_REQUEST);
  }
};

// Function to delete a folder
const deleteFolder = async (req: Request) => {
  try {
    const { id } = req.params;

    // check if folder has images if yes, then show error message else delete folder
    const folder = await Folder.findById(id);
    if (!folder) {
      throw new AppError('Folder not found', httpStatus.NOT_FOUND);
    }

    if (folder.images.length > 0) {
      throw new AppError('Folder has images, please delete images first', httpStatus.BAD_REQUEST);
    }

    await Folder.findByIdAndDelete(id);

    return 'Folder deleted successfully';
  } catch (error: any) {
    throw new AppError(error.message, httpStatus.BAD_REQUEST);
  }
};

const deleteBatchImages = async (req: Request) => {
  const { imageIds } = req.body;

  const images = await Gallery.find({ _id: { $in: imageIds } });

  const deletionPromises = images.map(async (image) => {
    try {
      if (image.url.includes('cloudinary')) {
        const publicId = extractPublicId(image.url);
        await media.deleteFile(publicId);
      } else {
        const fileName = image.url.split('/uploads/').pop();
        await media.deleteFile(fileName as string);
      }
      // Remove from database
      await Gallery.findByIdAndDelete(image._id);
    } catch (error: any) {
      throw new AppError(
        `Error deleting image: ${error.message}`,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  });

  await Promise.all(deletionPromises);

  return 'Batch image deletion completed';
};

const createAttachment = async (req: Request) => {
  console.log(req.files);
};

export const GalleryService = {
  getAllImages,
  getImagesByFolder,
  createImage,
  deleteImage,
  createFolder,
  deleteFolder,
  getFolders,
  createAttachment,
  deleteBatchImages
};
