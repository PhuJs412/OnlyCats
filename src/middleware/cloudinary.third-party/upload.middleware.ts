import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary.config';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: any) => {
    
    // Lấy userId từ req nếu có xác thực, hoặc dùng 'guest'
    const userId = req.user?.id || 'guest';
    const timestamp = Date.now();
    const ext = file.originalname.split('.').pop();
    return {
      folder: 'onlycats_media',
      resource_type: 'auto',
      public_id: `onlycats_${userId}_${timestamp}.${ext}`,
    };
  },
});

const upload = multer({ storage });

export default upload;