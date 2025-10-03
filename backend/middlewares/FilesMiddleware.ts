import multer from "multer";
import { google } from "googleapis";
import { getAuthClient, getDriveClient } from "@/services/googleDriveOAuth";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

type DriveFileId = string;

// const drive = google.drive({ version: "v3", auth: getAuthClient() });

const upload = multer({ storage });

const uploadToDrive = async (
  filePath: string,
  originalName: string,
  mimeType: string
): Promise<DriveFileId> => {
  const drive =await getDriveClient();
  const fileMetadata = {
    name: originalName,
  };

  const media = {
    mimeType,
    body: fs.createReadStream(filePath),
  };
  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id",
  });

  return response.data.id as string;
};

const getFileBase64FromDrive = async (fileId: string): Promise<string> => {
  const drive = await getDriveClient()
  const response = await drive.files.get(
    {
      fileId,
      alt: "media",
    },
    { responseType: "arraybuffer" }
  );

  const buffer = Buffer.from(response.data as ArrayBuffer);
  const base64 = buffer.toString("base64");

  // You probably want a Data URI for <img src="...">
  return `data:image/jpeg;base64,${base64}`;
};

const deleteFileFromDrive = async (fileId: string) => {
  try {
    const drive = await getDriveClient();
    await drive.files.delete({ fileId });
    console.log(`✅ File ${fileId} deleted from Drive`);
  } catch (err) {
    console.error("❌ Error deleting file:", err);
    throw err;
  }
};

export { upload, uploadToDrive, getFileBase64FromDrive, deleteFileFromDrive };