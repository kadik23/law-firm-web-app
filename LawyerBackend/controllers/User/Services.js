const db = require('../../models');
const Service = db.services;
const RequestService = db.request_service;
const ServiceFilesUploaded = db.service_files_uploaded;
const User = db.users;
const path = require('path');
const fs = require('fs');
const multer = require('multer');


const Problem = db.problems;

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
const getAllServices = async (req, res) => {
  try {
    let services = await Service.findAll({
      attributes: ['id', 'name', 'description', 'requestedFiles', 'coverImage', 'price', 'createdBy', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
    });

    if (services) {
      services = await Promise.all(services.map(async (service) => {
        const filePath = path.resolve(__dirname, '..', '..', service.coverImage);

        let base64Image = null;
        if (fs.existsSync(filePath)) {
          const fileData = fs.readFileSync(filePath);
          base64Image = `data:image/png;base64,${fileData.toString('base64')}`;
        }

        return {
          ...service.toJSON(),
          coverImage: base64Image
        };
      }));

      return res.status(200).json(services);
    }else {
      return res.status(401).send('Error fetching services');
    }

  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
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
const getOneService = async (req, res) => {
  try {
    const { id } = req.params;


    const service = await Service.findOne({
      where: { id },
    });

    if (service) {

        const filePath = path.resolve(__dirname, '..', '..', service.coverImage);

        let base64Image = null;
        if (fs.existsSync(filePath)) {
          const fileData = fs.readFileSync(filePath);
          base64Image = `data:image/png;base64,${fileData.toString('base64')}`;
        }

      return res.status(200).json({
        ...service.toJSON(),
        coverImage: base64Image
      });
    }else {
      return res.status(404).json({ error: 'Service not found' });    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
const assignClient = async (req, res) => {
  try {
    const clientId = req.user.id;
    const { serviceId, is_paid } = req.body;

    if (!clientId || !serviceId) {
      return res.status(400).json({ error: 'clientId and serviceId are required.' });
    }

    const client = await User.findByPk(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found.' });
    }

    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    const newRequest = await RequestService.create({
      clientId,
      serviceId,
      status: 'Pending',
      is_paid: typeof is_paid !== 'undefined' ? is_paid : false,
    });
    return res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error assigning client to service:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
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

const deleteServiceFiles = async (req, res) => {
  try {
    const { request_service_id } = req.params;
    const userId = req.user.id;

    if (!request_service_id) {
      return res.status(400).json({ error: 'Service ID is required' });
    }

    const filesToDelete = await ServiceFilesUploaded.findAll({
      where: { request_service_id },
    });

    if (filesToDelete.length === 0) {
      return res.status(404).json({ message: 'No files found for the specified service ID uploaded by the current user' });
    }

    filesToDelete.forEach((file) => {
      const filePath = path.join(__dirname, '../../uploads', file.file_name);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    const deletedCount = await ServiceFilesUploaded.destroy({
      where: { request_service_id },
    });

    return res.status(200).json({ message: `Deleted ${deletedCount} files for service ID ${request_service_id} uploaded by user ${userId}.` });
  } catch (error) {
    console.error('Error deleting service files:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
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



const updateServiceFile = async (req, res) => {
  try {
      const { uploaded_file_id } = req.params;

      if (!uploaded_file_id) {
          return res.status(400).json({ error: "Upload Service ID is required" });
      }

      if (!req.files || req.files.length === 0) {
          return res.status(400).json({ error: "New files are required" });
      }

      const fileRecords = await ServiceFilesUploaded.findAll({
        where: { id: uploaded_file_id },
        order: [["createdAt", "ASC"]],
    });
    

      if (fileRecords.length === 0) {
          return res.status(404).json({ error: "No file records found" });
      }

      const filesToProcess = req.files.slice(0, fileRecords.length);

      await Promise.all(
          filesToProcess.map(async (file, index) => {
              const fileRecord = fileRecords[index];
              const fileExt = path.extname(file.originalname);
              const newFileName = `requestService_${fileRecords[0].id}_file_${uploaded_file_id}${fileExt}`;
              const newFilePath = path.join(__dirname, "../../uploads", newFileName);

              const oldFilePath = path.join(__dirname, "../../uploads", fileRecord.file_name);
              if (fs.existsSync(oldFilePath)) {
                  fs.unlinkSync(oldFilePath);
              }

              fs.renameSync(file.path, newFilePath);

              fileRecord.file_name = newFileName;
              await fileRecord.save();
          })
      );

      const allFilesUploaded = await verifyAllFilesUploaded(fileRecords[0].request_service_id);

      return res.status(200).json({
          message: "Files updated successfully",
          updatedFiles: fileRecords.map(f => ({ id: f.id, file_name: f.file_name })),
          allFilesUploaded,
      });

  } catch (error) {
      console.error("Error updating service files:", error);
      return res.status(500).json({ error: "Internal server error: " + error.message });
  }
};

/**
* Helper function to verify if all expected files for a service request have been uploaded.
*/
const verifyAllFilesUploaded = async (requestServiceId) => {
  const requestService = await RequestService.findByPk(requestServiceId);
  if (!requestService || !requestService.requestedFiles) return false;

  let expectedFiles;
  try {
      expectedFiles = JSON.parse(requestService.requestedFiles);
  } catch (err) {
      return false;
  }

  const uploadedFiles = await ServiceFilesUploaded.findAll({
      where: { service_id: requestServiceId }
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

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadServiceFiles = async (req, res) => {
  try {
    upload.array('files')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Error uploading files: ' + err.message });
      }

      const request_service_id = req.params.request_service_id;
    
      if (!request_service_id) {
        return res.status(400).json({ 
          error: "Request Service ID is required",
          details: {
            params: req.params,
            body: req.body,
            query: req.query
          }
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "At least one file is required" });
      }

      const requestService = await RequestService.findByPk(request_service_id);
      if (!requestService) {
        return res.status(404).json({ error: "Request Service not found" });
      }

      const service = await Service.findOne({ where: { id: requestService.serviceId } });
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      let requestedFilesArray;
      try {
        requestedFilesArray = JSON.parse(service.requestedFiles);
      } catch (jsonError) {
        if (typeof service.requestedFiles === 'string') {
          requestedFilesArray = service.requestedFiles.split(',').map(file => file.trim());
        } else {
          requestedFilesArray = service.requestedFiles;
        }
      }
      const requiredFilesCount = requestedFilesArray.length;

      if (req.files.length !== requiredFilesCount) {
        return res.status(400).json({
          error: `You must upload exactly ${requiredFilesCount} files, but you uploaded ${req.files.length}.`,
        });
      }

      const uploadedFiles = await Promise.all(
        req.files.map(async (file, index) => {
          const serviceFileUpload = await ServiceFilesUploaded.create({
            request_service_id,
            file_name: file.originalname,
            status: "Pending",
          });

          const fileExt = path.extname(file.originalname);
          
          const newFileName = `requestService_${request_service_id}_file_${serviceFileUpload.id}${fileExt}`;
          
          const uploadDir = path.join(__dirname, '../../uploads');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const filePath = path.join(uploadDir, newFileName);

          fs.writeFileSync(filePath, file.buffer);

          await serviceFileUpload.update({
            file_name: newFileName
          });

          return serviceFileUpload;
        })
      );

      return res.status(201).json({
        message: "Files uploaded successfully.",
        files: uploadedFiles.map(file => file.toJSON()),
      });
    });
  } catch (error) {
    console.error("Error uploading service files:", error);
    return res.status(500).json({ error: "Internal server error: " + error.message });
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


const getServiceFiles = async (req, res) => {
  try {
    const { request_service_id } = req.params;

    if (!request_service_id) {
      return res.status(400).json({ error: "Service ID is required" });
    }

    const files = await ServiceFilesUploaded.findAll({
      where: { request_service_id },
    });

    if (!files.length) {
      return res.status(404).json({ message: "No files found for this service ID." });
    }

    const filesWithBase64 = files.map((file) => {
      const filePath = path.join(__dirname, "../../uploads", file.file_name);
      let base64Data = null;

      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        base64Data = fileBuffer.toString("base64");
      }

      return {
        id: file.id,
        file_name: file.file_name,
        base64: base64Data,
      };
    });

    return res.status(200).json({
      count: files.length,
      files: filesWithBase64,
    });
  } catch (error) {
    console.error("Error retrieving service files:", error);
    return res.status(500).json({ error: "Internal server error: " + error.message });
  }
};

const getAllServicesByProblem = async (req, res) => {
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

module.exports = {
  getAllServices,
  getOneService,
  assignClient,
  deleteServiceFiles,
  updateServiceFile,
  uploadServiceFiles,
  getServiceFiles,
  getAllServicesByProblem
};
