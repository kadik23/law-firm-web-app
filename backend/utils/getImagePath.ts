import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export const getImagePath = (imagePath: string): string => {
  if (isProduction) {
    return path.resolve(__dirname, '..', '..', 'dist', imagePath);
  } else {
    return path.resolve(__dirname, '..', '..', imagePath);
  }
};