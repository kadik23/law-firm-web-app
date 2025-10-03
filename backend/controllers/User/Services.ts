import { db } from '@/models/index';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import { Model, ModelCtor, Op } from 'sequelize';
import { IService } from '@/interfaces/Service';
import { IUser } from '@/interfaces/User';
import { IProblem } from '@/interfaces/Problem';
import { IServiceFilesUploaded } from '@/interfaces/ServiceFilesUploaded';
import { createNotification } from '../createNotification';
import { deleteFileFromDrive, getFileBase64FromDrive, upload, uploadToDrive } from '@/middlewares/FilesMiddleware';
const Service: ModelCtor<Model<IService>> = db.services;
const RequestService = db.request_service;
const ServiceFilesUploaded: ModelCtor<Model<IServiceFilesUploaded>> = db.service_files_uploaded;
const User: ModelCtor<Model<IUser>> = db.users;
const Problem: ModelCtor<Model<IProblem>> = db.problems;
const UPLOADS_DIR = path.join(__dirname, "../../uploads");

interface AssignedServiceResponse {
  id: number;
  request_service_id: number;
  name: string;
  description: string;
  requestedFiles: string[];
  coverImage: string | null;
  price: number;
  status: string;
  is_paid: boolean;
  createdAt: Date;
  updatedAt: Date;
  requestCreatedAt: Date;
  requestUpdatedAt: Date;
}

/**
 * @swagger
 * /user/services:
 *   get:
 *     summary: Get all services
 *     description: Retrieve a list of all services.
 *     tags:
 *       - Services
 *     responses:
 *       200:
 *         description: List of services retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   name:
 *                     type: string
 *                     example: "Premium Service"
 *                   description:
 *                     type: string
 *                     example: "This is a detailed description of the service."
 *                   requestedFiles:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["file1.png", "file2.pdf"]
 *                   coverImage:
 *                     type: string
 *                     example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *                   price:
 *                     type: string
 *                     example: "199.99"
 *                   createdBy:
 *                     type: integer
 *                     example: 1
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-01T12:00:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-01T12:00:00Z"
 *       500:
 *         description: Server error
 */
const getAllServices = async (req: Request, res: Response): Promise<void> => {
  try {
    let services: any = await Service.findAll({
      attributes: [
        "id",
        "name",
        "description",
        "requestedFiles",
        "coverImage",
        "price",
        "file_id",
        "createdBy",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
    });
    if (services) {
      const resultList: any[] = await Promise.all(
        services.map(async (service: Model<IService>) => {
            let base64Image = null;
            if (service.getDataValue("file_id") && service.getDataValue("file_id") !== '') {
                base64Image = await getFileBase64FromDrive(service.getDataValue("file_id"));
            }
            return {
              ...service.toJSON(),
              coverImage: base64Image,
            };
        })
      );
      res.status(200).json(resultList);
      return;
    } else {
      res.status(401).send("Error fetching services");
      return;
    }
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Server error: " + (error as any).message });
    return;
  }
};

/**
 * @swagger
 * /user/services/{id}:
 *   get:
 *     summary: Get a service by its ID
 *     description: Retrieve a specific service using its unique ID.
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the service
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 name:
 *                   type: string
 *                   example: "Premium Service"
 *                 description:
 *                   type: string
 *                   example: "This is a detailed description of the service."
 *                 requestedFiles:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["file1.png", "file2.pdf"]
 *                 coverImage:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *                 price:
 *                   type: string
 *                   example: "199.99"
 *                 createdBy:
 *                   type: integer
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-01T12:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-01T12:00:00Z"
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
const getOneService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findOne({ where: { id } });
    if (service) {
      let base64Image = null;
      if (service.getDataValue("file_id") && service.getDataValue("file_id") !== '') {
          base64Image = await getFileBase64FromDrive(service.getDataValue("file_id"));
      }
      res.status(200).json({
        ...service.toJSON(),
        coverImage: base64Image,
      });
      return;
    } else {
      res.status(404).json({ error: "Service not found" });
      return;
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

/**
 * @swagger
 * /user/services/assign_client:
 *   post:
 *     summary: Assign a client to a service
 *     description: Creates a new service request by assigning a client to a service.
 *     tags:
 *       - Services
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - serviceId
 *             properties:
 *               clientId:
 *                 type: number
 *                 example: 1
 *               serviceId:
 *                 type: number
 *                 example: 2
 *               status:
 *                 type: string
 *                 enum: [Completed, Pending, Canceled]
 *                 example: Pending
 *               is_paid:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Client successfully assigned to service.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request - missing or invalid data.
 *       404:
 *         description: Client or Service not found.
 *       500:
 *         description: Internal server error.
 */
const assignClient = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: 'Unauthorized: User ID is missing.' });
    return;
  }
  try {
    const clientId = req.user.id;
    const { serviceId, is_paid } = req.body;
    if (!clientId || !serviceId) {
      res.status(400).json({ error: "clientId and serviceId are required." });
      return;
    }
    const client = await User.findByPk(clientId);
    if (!client) {
      res.status(404).json({ error: "Client not found." });
      return;
    }
    const service = await Service.findByPk(serviceId);
    if (!service) {
      res.status(404).json({ error: "Service not found." });
      return;
    }
    const newRequest = await RequestService.create({
      clientId,
      serviceId,
      status: "Pending",
      is_paid: typeof is_paid !== "undefined" ? is_paid : false,
    });
    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error assigning client to service:", error);
    res.status(500).json({ error: "Internal server error: " + (error as any).message });
    return;
  }
};

/**
 * @swagger
 * /user/service-files/{request_service_id}:
 *   delete:
 *     summary: Delete service files uploaded by the current user
 *     description: Deletes all files associated with the specified service ID that were uploaded by the currently authenticated user.
 *     tags:
 *       - Service Files
 *     parameters:
 *       - in: path
 *         name: request_service_id
 *         required: true
 *         description: The ID of the service whose files should be deleted.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Service files deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Deleted X files for service ID {request_service_id} uploaded by user {userId}."
 *       400:
 *         description: Service ID is required.
 *       404:
 *         description: No files found for the specified service ID uploaded by the current user.
 *       500:
 *         description: Internal server error.
 */

const deleteServiceFiles = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: 'Unauthorized: User ID is missing.' });
    return;
  }
  try {
    const { request_service_id } = req.params;
    const userId = req.user.id;
    if (!request_service_id) {
      res.status(400).json({ error: "Service ID is required" });
      return;
    }
    const filesToDelete = await ServiceFilesUploaded.findAll({ where: { request_service_id } });
    if (filesToDelete.length === 0) {
      res.status(404).json({ message: "No files found for the specified service ID uploaded by the current user" });
      return;
    }
    await Promise.all(filesToDelete.map(async (file: Model<any>) => {
      if (file.getDataValue('file_id') && file.getDataValue('file_id') !== '') {
        await deleteFileFromDrive(file.getDataValue('file_id'));
      }
    }));
    const deletedCount = await ServiceFilesUploaded.destroy({ where: { request_service_id } });
    res.status(200).json({ message: `Deleted ${deletedCount} files for service ID ${request_service_id} uploaded by user ${userId}.` });
  } catch (error: any) {
    console.error("Error deleting service files:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
    return;
  }
};
/**
 * @swagger
 * /user/service-files/{request_service_id}:
 *   put:
 *     summary: Update a service file uploaded by the current user
 *     description: Updates a file for a specific service uploaded by the currently authenticated user.
 *     tags:
 *       - Service Files
 *     parameters:
 *       - in: path
 *         name: request_service_id
 *         required: true
 *         description: The ID of the service request whose file should be updated.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File updated successfully"
 *                 file:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     request_service_id:
 *                       type: string
 *                     file_name:
 *                       type: string
 *       400:
 *         description: Service ID or new file is missing.
 *       404:
 *         description: No file found for the specified service ID uploaded by the current user.
 *       500:
 *         description: Internal server error.
 */

const updateServiceFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uploaded_file_id } = req.params;

    if (!uploaded_file_id) {
      res.status(400).json({ error: "Upload Service ID is required" });
      return;
    }

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      res.status(400).json({ error: "New files are required" });
      return;
    }

    // Parse ids: allow "1" or "1,2,3"
    const ids = String(uploaded_file_id)
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => Number(x))
      .filter((x) => !Number.isNaN(x));

    if (ids.length === 0) {
      res.status(400).json({ error: "Invalid uploaded_file_id" });
      return;
    }

    // Fetch the file records (order is important to align with req.files)
    const fileRecords = await ServiceFilesUploaded.findAll({
      where: { id: { [Op.in]: ids } },
      order: [["createdAt", "ASC"]],
    });

    if (fileRecords.length === 0) {
      res.status(404).json({ error: "No file records found" });
      return;
    }

    // Ensure same count if you expect a 1-to-1 mapping
    const files = req.files as Express.Multer.File[];
    if (files.length !== fileRecords.length) {
      res.status(400).json({
        error: `Files count (${files.length}) does not match record count (${fileRecords.length}).`,
      });
      return;
    }

    // Make sure uploads dir exists
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    // Replace each file:
    await Promise.all(
      files.map(async (file: Express.Multer.File, index: number) => {
        const record = fileRecords[index];

        // Old local file (if you were storing names before)
        const oldLocalName = record.getDataValue("file_name") as string | null;
        const oldLocalPath =
          oldLocalName ? path.join(UPLOADS_DIR, oldLocalName) : null;

        // Old Drive file (if present)
        const oldDriveFileId = record.getDataValue("file_id") as string | null;

        // Use a consistent new local temp name (kept only until Drive upload)
        const fileExt = path.extname(file.originalname);
        const newFileName = `requestService_${record.getDataValue("id")}_file_${record.getDataValue("id")}${fileExt}`;
        const newFilePath = path.join(UPLOADS_DIR, newFileName);

        // Remove old local file if it exists (you are moving to Drive-first approach)
        try {
          if (oldLocalPath && fs.existsSync(oldLocalPath)) {
            fs.unlinkSync(oldLocalPath);
          }
        } catch (e) {
          // non-fatal
          console.warn(`Could not remove old local file ${oldLocalPath}`, e);
        }

        // Move multer temp file to our canonical name (still local temp)
        fs.renameSync(file.path, newFilePath);

        // Upload to Drive from local temp
        let newDriveFileId: string;
        try {
          newDriveFileId = await uploadToDrive(newFilePath, file.originalname, file.mimetype);
        } finally {
          // Always remove the local temp file after upload attempt
          try {
            if (fs.existsSync(newFilePath)) fs.unlinkSync(newFilePath);
          } catch (e) {
            console.warn(`Could not remove temp file ${newFilePath}`, e);
          }
        }

        // Delete old Drive file if it existed
        if (oldDriveFileId) {
          try {
            await deleteFileFromDrive(oldDriveFileId);
          } catch (e) {
            // non-fatal, just log
            console.warn(`Could not delete old Drive file ${oldDriveFileId}`, e);
          }
        }

        // Update DB record: keep the new logical file name + Drive ID
        record.set("file_name", newFileName); // keep for history if you want
        record.set("file_id", newDriveFileId); // primary source of truth
        await record.save();
      })
    );

    // All files belong to the same request_service_id
    const requestServiceId = fileRecords[0].getDataValue("request_service_id");

    const allFilesUploaded = await verifyAllFilesUploaded(requestServiceId);

    // Resolve serviceId -> serviceName (unchanged)
    let serviceId: number | undefined;
    if (requestServiceId) {
      const requestService = await RequestService.findByPk(requestServiceId);
      if (requestService) {
        const rawServiceId = requestService.getDataValue("serviceId");
        if (typeof rawServiceId === "string") {
          const parsed = parseInt(rawServiceId, 10);
          if (!isNaN(parsed)) serviceId = parsed;
        } else if (typeof rawServiceId === "number") {
          serviceId = rawServiceId;
        }
      }
    }

    let serviceName = "Service";
    if (serviceId) {
      const service = await Service.findByPk(serviceId);
      if (service) {
        serviceName = service.getDataValue("name");
      }
    }

    // Reset status for the updated files
    await ServiceFilesUploaded.update(
      { status: "Pending", rejection_reason: null },
      {
        where: {
          request_service_id: requestServiceId,
          id: { [Op.in]: fileRecords.map((f: Model<any>) => f.getDataValue("id")) },
        },
      }
    );

    await createNotification(
      "Documents",
      `Tous les documents ont été ajoutés pour la demande ${serviceName}`,
      2,
      Number(requestServiceId),
      req?.user?.id as number
    );

    res.status(200).json({
      message: "Files updated successfully",
      updatedFiles: fileRecords.map((f: Model<any>) => ({
        id: f.getDataValue("id"),
        file_name: f.getDataValue("file_name"),
        file_id: f.getDataValue("file_id"),
      })),
      allFilesUploaded,
    });
  } catch (error: any) {
    console.error("Error updating service files:", error);
    res
      .status(500)
      .json({ error: "Internal server error: " + (error?.message || "unknown") });
  }
};

const verifyAllFilesUploaded = async (requestServiceId: string | number) => {
  const idNum = typeof requestServiceId === "string" ? parseInt(requestServiceId, 10) : requestServiceId;
  const requestService = await RequestService.findByPk(idNum);
  if (!requestService) return false;

  const requestedFilesRaw = requestService.get("requestedFiles") as string | string[] | undefined;
  if (!requestedFilesRaw) return false;

  let expectedFiles: string[];
  try {
    expectedFiles = Array.isArray(requestedFilesRaw) ? requestedFilesRaw : JSON.parse(requestedFilesRaw as string);
  } catch {
    return false;
  }

  const uploadedFiles = await ServiceFilesUploaded.findAll({
    where: { request_service_id: idNum },
  });

  return uploadedFiles.length === expectedFiles.length;
};
/**
 * @swagger
 * /user/service-files/{request_service_id}:
 *   post:
 *     summary: Upload multiple files for a service request
 *     description: Uploads multiple files and stores their metadata in the database.
 *     tags:
 *       - Service Files
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         description: The ID of the service to which files are uploaded.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Files uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Files uploaded successfully."
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       file_name:
 *                         type: string
 *                       service_id:
 *                         type: string
 *       400:
 *         description: Service ID or files missing.
 *       500:
 *         description: Internal server error.
 */

const uploadServiceFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    upload.array("files")(req, res, async (err) => {
      if (err) {
        res
          .status(400)
          .json({ error: "Error uploading files: " + err.message });
        return;
      }

      const request_service_id = req.params.request_service_id;

      if (!request_service_id) {
        res.status(400).json({
          error: "Request Service ID is required",
          details: {
            params: req.params,
            body: req.body,
            query: req.query,
          },
        });
        return;
      }

      if (!req.files || req.files.length === 0) {
        res.status(400).json({ error: "At least one file is required" });
        return;
      }

      const requestService = await RequestService.findByPk(request_service_id);
      if (!requestService) {
        res.status(404).json({ error: "Request Service not found" });
        return;
      }

      const service = await Service.findOne({
        where: { id: requestService.getDataValue('serviceId') },
      });
      if (!service) {
        res.status(404).json({ error: "Service not found" });
        return;
      }

      let requestedFilesArray: string[] = [];
      const requestedFilesRaw = service.getDataValue('requestedFiles');
      if (typeof requestedFilesRaw === 'string') {
        try {
          const parsed = JSON.parse(requestedFilesRaw);
          if (Array.isArray(parsed)) {
            requestedFilesArray = parsed;
        } else {
            requestedFilesArray = String(requestedFilesRaw).split(',').map((file: string) => file.trim());
          }
        } catch (jsonError) {
          requestedFilesArray = String(requestedFilesRaw).split(',').map((file: string) => file.trim());
        }
      } else if (Array.isArray(requestedFilesRaw)) {
        requestedFilesArray = requestedFilesRaw;
      } else if (requestedFilesRaw) {
        requestedFilesArray = String(requestedFilesRaw).split(',').map((file: string) => file.trim());
      }
      const requiredFilesCount = requestedFilesArray.length;

      if (req.files.length !== requiredFilesCount) {
        res.status(400).json({
          error: `You must upload exactly ${requiredFilesCount} files, but you uploaded ${req.files.length}.`,
        });
        return;
      }

      const uploadedFiles = await Promise.all((req.files as Express.Multer.File[]).map(async (file: Express.Multer.File, index: number) => {
        const fileId = await uploadToDrive(
          file.path,
          file.originalname,
          file.mimetype
        );
        const serviceFileUpload = await ServiceFilesUploaded.create({
          request_service_id: Number(request_service_id),
          file_name: file.originalname,
          status: "Pending",
          file_id: fileId,
          rejection_reason: null
        });

        return serviceFileUpload;
      }));
      
      await createNotification(
        "Documents",
        `Nouveau document ajouté par ${req.user.name} pour la demande ${service.getDataValue('name')}`,
        req?.user?.id as number,
        Number(request_service_id),
        2
      );

      res.status(201).json({
        message: "Files uploaded successfully.",
        files: uploadedFiles.map((file) => file.toJSON()),
      });
    });
  } catch (error) {
    console.error("Error uploading service files:", error);
    res
      .status(500)
      .json({ error: "Internal server error: " + (error as any).message });
    return;
  }
};
/**
 * @swagger
 * /user/service-files/{request_service_id}:
 *   get:
 *     summary: Get all service files with Base64 encoding
 *     description: Retrieves all files associated with a service request, including the file count and Base64-encoded file data.
 *     tags:
 *       - Service Files
 *     parameters:
 *       - in: path
 *         name: request_service_id
 *         required: true
 *         description: The ID of the service request whose files should be retrieved.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of files retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       file_name:
 *                         type: string
 *                       base64:
 *                         type: string
 *                         example: "iVBORw0KGgoAAAANSUhEUgAAABAAAAA..."
 *       400:
 *         description: Service ID is required.
 *       404:
 *         description: No files found for the specified service ID.
 *       500:
 *         description: Internal server error.
 */

const getServiceFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { request_service_id } = req.params;

    if (!request_service_id) {
      res.status(400).json({ error: "Service ID is required" });
      return;
    }

    const files = await ServiceFilesUploaded.findAll({
      where: { request_service_id },
    });

    if (!files.length) {
      res
        .status(404)
        .json({ message: "No files found for this service ID." });
      return;
    }

    const filesWithBase64 = await Promise.all(files.map(async (file: Model<any>) => {
      let base64Data = null;
      if (file.getDataValue('file_id') && file.getDataValue('file_id') !== '') {
        base64Data = await getFileBase64FromDrive(file.getDataValue('file_id'));
      }

      return {
        id: file.getDataValue('id'),
        file_name: file.getDataValue('file_name'),
        base64: base64Data,
        status: file.getDataValue('status'),
        rejection_reason: file.getDataValue('rejection_reason')
      };
    }));

    res.status(200).json({
      count: files.length,
      files: filesWithBase64,
    });
  } catch (error) {
    console.error("Error retrieving service files:", error);
    res
      .status(500)
      .json({ error: "Internal server error: " + (error as any).message });
    return;
  }
};

const getAllServicesByProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    let services = await Service.findAll({
      include: [
        {
          model: Problem,
          as: 'problems', 
          where: { id: req.params.problem_id },
          attributes: [],
        },
      ],
      attributes: ['id', 'name', 'description', 'requestedFiles', 'coverImage', 'price', 'createdBy', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
    });
    if (services) {
      const servicesWithImages = await Promise.all(services.map(async (service: Model<IService>) => {
        let base64Image = null;
        if (service.getDataValue("file_id") && service.getDataValue("file_id") !== '') {
            base64Image = await getFileBase64FromDrive(service.getDataValue("file_id"));
        }
        return {
          ...service.toJSON(),
          coverImage: base64Image
        };
      }));

      res.status(200).json(servicesWithImages);
    }else {
      res.status(401).send('Error fetching services');
    }

  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Server error: ' + (error as any).message });
  }
};
/**
 * @swagger
 * /user/services/{problem_id}:
 *   get:
 *     summary: Get a service by problem id
 *     description: Retrieve a specific service using problem id.
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the service
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 name:
 *                   type: string
 *                   example: "Premium Service"
 *                 description:
 *                   type: string
 *                   example: "This is a detailed description of the service."
 *                 requestedFiles:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["file1.png", "file2.pdf"]
 *                 coverImage:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *                 price:
 *                   type: string
 *                   example: "199.99"
 *                 createdBy:
 *                   type: integer
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-01T12:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-01T12:00:00Z"
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/assigned-services:
 *   get:
 *     summary: Get all services assigned to the current user
 *     description: Retrieve a list of all services that the current user has been assigned to.
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned services retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   name:
 *                     type: string
 *                     example: "Premium Service"
 *                   description:
 *                     type: string
 *                     example: "This is a detailed description of the service."
 *                   requestedFiles:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["file1.png", "file2.pdf"]
 *                   coverImage:
 *                     type: string
 *                     example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *                   price:
 *                     type: string
 *                     example: "199.99"
 *                   status:
 *                     type: string
 *                     example: "Pending"
 *                   is_paid:
 *                     type: boolean
 *                     example: false
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-01T12:00:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-01T12:00:00Z"
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Server error
 */
const getAssignedServices = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: 'Unauthorized: User ID is missing.' });
    return;
  }
  try {
    const userId = req.user.id;
    const serviceRequests = await RequestService.findAll({
      where: { clientId: userId },
      include: [
        {
          model: Service,
          as: 'service', 
          attributes: ['id', 'name', 'description', 'requestedFiles', 'coverImage', 'price', 'createdAt', 'updatedAt', 'file_id'],
          required: true
        }
      ],
      order: [['createdAt', 'DESC']],
    });
    if (!serviceRequests || serviceRequests.length === 0) {
      res.status(200).json([]);
      return;
    }
    const services = await Promise.all(serviceRequests.map(async (request: Model<any>) => {
      try {
        const service = request.getDataValue('service');
        if (!service) {
          console.warn(`No service found for request ${request.getDataValue('id')}`);
          return null;
        }
        let base64Image = null;
        if (service.getDataValue('file_id') && service.getDataValue('file_id') !== '') {
          base64Image = await getFileBase64FromDrive(service.getDataValue('file_id'));
        }
        return {
          id: service.getDataValue('id'),
          request_service_id: request.getDataValue('id'),
          name: service.getDataValue('name'),
          description: service.getDataValue('description'),
          requestedFiles: service.getDataValue('requestedFiles'),
          coverImage: base64Image,
          price: service.getDataValue('price'),
          status: request.getDataValue('status'),
          is_paid: request.getDataValue('is_paid'),
          createdAt: service.getDataValue('createdAt'),
          updatedAt: service.getDataValue('updatedAt'),
          requestCreatedAt: request.getDataValue('createdAt'),
          requestUpdatedAt: request.getDataValue('updatedAt')
        } as AssignedServiceResponse;
      } catch (error: any) {
        console.error(`Error processing request ${request.getDataValue('id')}:`, error);
        return null;
      }
    }));
    const filteredServices = services.filter((service): service is AssignedServiceResponse => service !== null);
    res.status(200).json(filteredServices);
  } catch (error: any) {
    console.error('Error in getAssignedServices:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

/**
 * @swagger
 * /user/remove-assign/{request_service_id}:
 *   delete:
 *     summary: Remove a specific service assignment
 *     description: Remove a service assignment for the current user by request_service_id
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: request_service_id
 *         required: true
 *         description: The ID of the service request to remove
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service assignment removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Service assignment removed successfully"
 *       404:
 *         description: Service assignment not found or not owned by user
 *       500:
 *         description: Server error
 */
const removeAssign = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: 'Unauthorized: User ID is missing.' });
    return;
  }
  try {
    const { request_service_id } = req.params;
    const userId = req.user.id;
    if (!request_service_id) {
      res.status(400).json({ error: 'Request service ID is required' });
      return;
    }
    // Transaction for consecutive deletes
    await db.sequelize.transaction(async (t) => {
    const deletedCount = await RequestService.destroy({
      where: {
        id: request_service_id,
        clientId: userId
        },
        transaction: t
    });
    if (deletedCount === 0) {
        res.status(404).json({ error: 'Service assignment not found or not owned by user' });
        return;
    }
      await ServiceFilesUploaded.destroy({ where: { request_service_id }, transaction: t });
      res.status(200).json({ message: 'Service assignment removed successfully' });
    });
  } catch (error: any) {
    console.error('Error removing service assignment:', error);
    res.status(500).json({ error: 'Server error: ' + (error as any).message });
  }
};

/**
 * @swagger
 * /user/remove-all-assign:
 *   delete:
 *     summary: Remove all service assignments for current user
 *     description: Remove all service assignments for the currently authenticated user
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All service assignments removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All service assignments removed successfully"
 *                 deletedCount:
 *                   type: integer
 *                   example: 3
 *       500:
 *         description: Server error
 */
const removeAllAssign = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: 'Unauthorized: User ID is missing.' });
    return;
  }
  try {
    const userId = req.user.id;
    const userRequests = await RequestService.findAll({
      where: { clientId: userId },
      attributes: ['id']
    });
    if (!userRequests || userRequests.length === 0) {
      res.status(200).json({ message: 'No service assignments found', deletedCount: 0 });
      return;
    }
    const requestIds = userRequests.map((request: Model<any>) => request.getDataValue('id'));
    // Transaction for consecutive deletes
    await db.sequelize.transaction(async (t) => {
      await ServiceFilesUploaded.destroy({ where: { request_service_id: requestIds }, transaction: t });
      const deletedCount = await RequestService.destroy({ where: { clientId: userId }, transaction: t });
      res.status(200).json({ message: 'All service assignments removed successfully', deletedCount });
    });
  } catch (error: any) {
    console.error('Error removing all service assignments:', error);
    res.status(500).json({ error: 'Server error: ' + (error as any).message });
  }
};

/**
 * @swagger
 * /user/assigned-services/{id}:
 *   get:
 *     summary: Get a single assigned service by ID
 *     description: Retrieve details of a specific service that has been assigned to the current user, including the request_service_id.
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the service to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assigned service retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 request_service_id:
 *                   type: string
 *                   example: "45"
 *                 name:
 *                   type: string
 *                   example: "Premium Service"
 *                 description:
 *                   type: string
 *                   example: "This is a detailed description of the service."
 *                 requestedFiles:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["file1.png", "file2.pdf"]
 *                 coverImage:
 *                   type: string
 *                   example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *                 price:
 *                   type: string
 *                   example: "199.99"
 *                 status:
 *                   type: string
 *                   example: "Pending"
 *                 is_paid:
 *                   type: boolean
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-01T12:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-01T12:00:00Z"
 *       404:
 *         description: Service not found or not assigned to user
 *       500:
 *         description: Server error
 */
const getOneAssignedService = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: 'Unauthorized: User ID is missing.' });
    return;
  }
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const serviceRequest = await RequestService.findOne({
      where: { clientId: userId, serviceId: id },
      include: [
        { model: Service, as: 'service', required: true }
      ]
    });
    if (!serviceRequest) {
      res.status(404).json({ error: "Service not found or not assigned to user" });
      return;
    }
    const service = serviceRequest.get('service') as Model<IService> | undefined;
    if (!service) {
      res.status(404).json({ error: "Service not found or not assigned to user" });
      return;
    }
    res.status(200).json({
      id: service.getDataValue('id'),
      request_service_id: serviceRequest.getDataValue('id'),
      name: service.getDataValue('name'),
      description: service.getDataValue('description'),
      requestedFiles: service.getDataValue('requestedFiles'),
      price: service.getDataValue('price'),
      status: serviceRequest.getDataValue('status'),
      is_paid: serviceRequest.getDataValue('is_paid'),
      createdAt: service.getDataValue('createdAt'),
      updatedAt: service.getDataValue('updatedAt')
    });
  } catch (error: any) {
    console.error('Error in getOneAssignedService:', error);
    res.status(500).json({ error: 'Server error', details: (error as any).message });
  }
};

export {
  getAllServices,
  getOneService,
  assignClient,
  deleteServiceFiles,
  updateServiceFile,
  uploadServiceFiles,
  getServiceFiles,
  getAllServicesByProblem,
  getAssignedServices,
  removeAllAssign,
  removeAssign,
  getOneAssignedService
};
