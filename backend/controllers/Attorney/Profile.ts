import { Request, Response } from "express";
import { db } from "@/models/index";
import { getFileBase64FromDrive, upload, uploadToDrive } from "@/middlewares/FilesMiddleware";
import { Op, Model, ModelCtor, where } from "sequelize";
import { imageToBase64DataUri } from "@/utils/imageUtils";
import { IAttorney } from "@/interfaces/Attorney";

const Attorney: ModelCtor<Model<IAttorney>> = db.attorneys;

export const uploadFile = upload.single("coverImage");

export const updateProfileImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    uploadFile(req, res, async (err: any) => {
      if (err) {
        res.status(400).json({ error: "Error uploading file: " + err.message });
        return;
      }
      if (!req.file) {
        res.status(400).json({ error: "Profile image is required." });
        return;
      }
      const fileId = await uploadToDrive(
        req.file.path,
        req.file.originalname,
        req.file.mimetype
      );
      const filePath = req.file.path;
      const base64Image = imageToBase64DataUri(filePath);

      Attorney.update(
        {
          file_id: fileId,
        },
        { where: { user_id: req.user.id } }
      );

      res
        .status(201)
        .json({ message: "Image updated successfully", base64Image });
    });
  } catch (error: any) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

export const getAttorneyProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let attorney = await Attorney.findOne({ where: { user_id: req.user.id } });
    if (attorney) {
        let base64Image
        if (attorney.getDataValue("file_id") && attorney.getDataValue("file_id") !== '') {
            base64Image = await getFileBase64FromDrive(attorney.getDataValue("file_id"));
        }
        const attorneyRes = {
            ...attorney.toJSON(),
            picture: base64Image,
        };
      res.status(200).json(attorneyRes);
    } else {
      res.status(401).send("Error fetching attorneys");
      return;
    }
  } catch (error: any) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
};
