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

export const resolveImagePath = (filePath: string): string | null => {
  if (!filePath) return null;

  if (fs.existsSync(filePath)) {
    return filePath;
  }

  const candidates = [
    path.resolve(filePath),
    path.join(__dirname, '../', filePath),
    path.join(__dirname, '../../', filePath),
    path.join(__dirname, '../uploads', path.basename(filePath)),
    path.join(__dirname, '../uploads/seeder', path.basename(filePath)),
    path.join(process.cwd(), filePath),
    path.join(process.cwd(), 'backend', filePath),
    path.join(process.cwd(), 'uploads', path.basename(filePath)),
    path.join(process.cwd(), 'uploads/seeder', path.basename(filePath)),
    path.join(process.cwd(), 'backend/uploads', path.basename(filePath)),
    path.join(process.cwd(), 'backend/uploads/seeder', path.basename(filePath)),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
};

export const imageToBase64DataUri = (filePath: string): string | null => {
  try {
    if (!filePath) return null;

    // If it's already a Data URI or web URL, return it directly
    if (filePath.startsWith('data:image') || filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    const resolvedPath = resolveImagePath(filePath);
    if (!resolvedPath) {
      return null;
    }
    
    const fileData = fs.readFileSync(resolvedPath);
    const mimeType = getImageMimeType(resolvedPath);
    const base64Data = fileData.toString('base64');
    
    return `data:${mimeType};base64,${base64Data}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};