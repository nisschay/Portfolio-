/**
 * File Upload Middleware
 * Configures Multer for handling file uploads
 */

import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { ApiError } from './errorHandler.js';

// Ensure upload directories exist
const uploadDirs = ['uploads', 'uploads/projects', 'uploads/blog'];
uploadDirs.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Allowed file types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Configure storage for project images
 */
const projectStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads/projects'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

/**
 * Configure storage for blog images
 */
const blogStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads/blog'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

/**
 * File filter to validate file types
 */
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest(
      `Invalid file type: ${file.mimetype}. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
    ) as unknown as null, false);
  }
};

/**
 * Multer instance for project image uploads
 */
export const uploadProjectImage = multer({
  storage: projectStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter,
});

/**
 * Multer instance for blog image uploads
 */
export const uploadBlogImage = multer({
  storage: blogStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter,
});

/**
 * Delete a file from the uploads directory
 */
export function deleteUploadedFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      resolve();
      return;
    }

    // Security: ensure the path is within uploads directory
    const fullPath = path.join(process.cwd(), filePath);
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    if (!fullPath.startsWith(uploadsDir)) {
      reject(new Error('Invalid file path'));
      return;
    }

    fs.unlink(fullPath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Error deleting file:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Get the public URL for an uploaded file
 */
export function getUploadUrl(filename: string, type: 'projects' | 'blog'): string {
  return `/uploads/${type}/${filename}`;
}
