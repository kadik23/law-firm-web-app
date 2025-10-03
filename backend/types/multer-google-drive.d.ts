declare module "multer-google-drive" {
  import { StorageEngine } from "multer";

  interface GoogleDriveStorageOptions {
    drive: drive_v3.Drive;
    parents: string;
    fileName?: (
      req: Express.Request,
      file: Express.Multer.File,
      cb: (err: Error | null, filename: string) => void
    ) => void;

  }

  export default function GoogleDriveStorage(
    options: GoogleDriveStorageOptions
  ): StorageEngine;
}
