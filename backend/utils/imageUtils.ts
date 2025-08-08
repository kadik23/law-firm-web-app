import fs from 'fs';
import path from 'path';

export const getImageMimeType = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase();
  
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    case '.bmp':
      return 'image/bmp';
    default:
      return 'image/png';
  }
};

export const imageToBase64DataUri = (filePath: string): string | null => {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileData = fs.readFileSync(filePath);
    const mimeType = getImageMimeType(filePath);
    const base64Data = fileData.toString('base64');
    
    return `data:${mimeType};base64,${base64Data}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};