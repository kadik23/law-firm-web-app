// filesMiddleware.ts
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, 'uploads/'); // Directory to save the uploaded files
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Save file with a unique name
    }
});

// Create multer upload instance
const upload = multer({
    storage: storage,
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (['application/pdf', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, JPEG, and PNG files are allowed!'));
        }
    }
});

export { upload };