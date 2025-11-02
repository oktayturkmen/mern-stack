import type { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

// Configure Cloudinary from env (optional fields handled by SDK; will throw if missing on use)
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
});

function uploadBufferToCloudinary(buffer: Buffer): Promise<{ url: string; public_id: string }>
{
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'mern-store/products', resource_type: 'image' },
      (error, result) => {
        if (error || !result) return reject(error || new Error('No result from Cloudinary'));
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function uploadImages(req: Request, res: Response) {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    if (!files.length) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const results = await Promise.all(files.map((f) => uploadBufferToCloudinary(f.buffer)));
    return res.status(201).json({
      message: 'Uploaded successfully',
      images: results.map(r => r.url),
      publicIds: results.map(r => r.public_id)
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Upload failed', err);
    return res.status(500).json({ message: 'Upload failed' });
  }
}


