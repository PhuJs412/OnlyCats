import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary.config';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: any) => {
    const userId = req.user?.id || 'guest';
    const timestamp = Date.now();
    return {
      folder: 'onlycats_media',
      resource_type: 'auto',
      public_id: `onlycats_${userId}_${timestamp}`,
    };
  },
});

const upload = multer({ storage });

export default upload;