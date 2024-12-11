import * as zod from 'zod';

const fileSchema = zod.object({
  originalname: zod.string().min(1, 'File name is required'),
  mimetype: zod.string().regex(/^image\/(jpeg|png|gif|webp)$/, 'Invalid file type'),
  size: zod.number().max(5 * 1024 * 1024, 'File size exceeds the limit of 5 MB')
});

// Validation schema for uploading images
export const uploadImageToGallery = zod
  .object({
    body: zod.object({
      folder: zod.string({ required_error: 'Folder name is required' })
    }),
    files: zod.array(fileSchema).max(10, 'You can upload up to 10 images at a time')
  })
  .refine((data) => data.files?.length > 0, {
    message: 'At least one file must be uploaded',
    path: ['files']
  });

export const deleteImageFromGallery = zod.object({
  body: zod.object({
    id: zod.string({
      message: 'Please provide an image ID'
    }),
    public_id: zod.string({
      message: 'Please provide a public ID'
    })
  })
});

export const createFolder = zod.object({
  body: zod.object({
    name: zod.string({
      message: 'Please provide a folder name'
    })
  })
});
