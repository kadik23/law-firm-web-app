const db = require('../../models');
const Service = db.services;
const RequestService = db.request_service;
const ServiceFilesUploaded = db.service_files_uploaded;
const User = db.users;
const path = require('path');
const fs = require('fs');

console.log("RequestService:", RequestService);

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
    return res.status(200).json(services);
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
    const service = await Service.findOne({ where: { id } });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    return res.status(200).json(service);
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
    const { clientId, serviceId, status, is_paid } = req.body;

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
      status: status || 'Pending',
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
 * /user/service-files:
 *   delete:
 *     summary: Delete all service files
 *     description: Deletes all records from the service_files_uploaded table.
 *     tags:
 *       - Service Files
 *     responses:
 *       200:
 *         description: All service files deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All service files have been deleted successfully."
 *       500:
 *         description: Internal server error.
 */
const deleteAllFiles = async (req, res) => {
  try {
    await ServiceFilesUploaded.destroy({ where: {} });
    return res.status(200).json({ message: 'All service files have been deleted successfully.' });
  } catch (error) {
    console.error('Error deleting service files:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

/**
 * @swagger
 * /user/service-files/{id}:
 *   put:
 *     summary: Update a service file
 *     description: Replaces an existing file (on disk and in the DB) with a new file by ID.
 *     tags:
 *       - Service Files
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The file record ID.
 *         schema:
 *           type: string
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
 *                     service_id:
 *                       type: string
 *                     file_name:
 *                       type: string
 *                 allFilesUploaded:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Missing file record ID or new file.
 *       404:
 *         description: File record not found.
 *       500:
 *         description: Internal server error.
 */
const updateServiceFile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "File record ID is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "New file is required" });
    }

    const fileRecord = await ServiceFilesUploaded.findByPk(id);
    if (!fileRecord) {
      return res.status(404).json({ error: "File record not found" });
    }

    const currentFilePath = path.join(__dirname, '../../uploads', fileRecord.file_name);
    
    if (fs.existsSync(currentFilePath)) {
      fs.unlinkSync(currentFilePath);
    }

    const newFileName = req.file.filename;

    fileRecord.file_name = newFileName;
    await fileRecord.save();

    const allFilesUploaded = await verifyAllFilesUploaded(fileRecord.service_id);
    return res.status(200).json({
      message: "File updated successfully",
      file: fileRecord,
      allFilesUploaded
    });
  } catch (error) {
    console.error("Error updating service file:", error);
    return res.status(500).json({ error: "Internal server error: " + error.message });
  }
};

/**
 * Helper function to verify if all expected files for a service request have been uploaded.
 * This compares the expected files (stored in requestService.requestedFiles) with the count of uploaded files.
 */
const verifyAllFilesUploaded = async (requestServiceId) => {
  const requestService = await RequestService.findByPk(requestServiceId);
  if (!requestService) return false;

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

module.exports = {
  getAllServices,
  getOneService,
  assignClient,
  deleteAllFiles,
  updateServiceFile,
};
