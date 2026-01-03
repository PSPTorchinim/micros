// Helper to upload a media file to Strapi and return the uploaded file entity
import fs from 'fs';
import path from 'path';

/**
 * Upload a file from disk to Strapi's upload plugin.
 * @param strapi Strapi instance
 * @param filePath Absolute path to the file
 * @returns The uploaded file entity (with id, url, etc.)
 */
export async function uploadMedia(strapi: any, filePath: string) {
  const fileName = path.basename(filePath);
  // Read the file once to avoid TOCTOU race condition
  const fileBuffer = fs.readFileSync(filePath);
  const fileSize = fileBuffer.length;

  // Simulate a file upload (Strapi v4)
  const uploadedFiles = await strapi
    .plugin('upload')
    .service('upload')
    .upload({
      data: {},
      files: {
        path: filePath,
        name: fileName,
        type: 'image/jpeg', // or detect from extension
        size: fileSize,
        buffer: fileBuffer,
      },
    });
  return Array.isArray(uploadedFiles) ? uploadedFiles[0] : uploadedFiles;
}
