const db = require('../../models');
const { upload } = require('../../middlewares/FilesMiddleware');
const path = require('path');
const fs = require('fs');

const Service = db.services;

/**
 * @swagger
 * /admin/services/create:
 *   post:
 *     summary: Create a new service
 *     description: Create a new service in the system.
 *     tags:
 *       - Services
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - requestedFiles
 *               - coverImage
 *               - price
 *               - createdBy
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Premium Service"
 *               description:
 *                 type: string
 *                 example: "This is a detailed description of the service."
 *               requestedFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["file1.png", "file2.pdf"]
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               price:
 *                 type: string
 *                 example: "199.99"
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */

const uploadFile = upload.single('coverImage');

const createService = async (req, res) => {
  try {
    uploadFile(req, res, async (err) => {
      if (err) {
        return res.status(400).send({ error: 'Error uploading file: ' + err.message });
      }

      const uploadedFile = req.file;
      if (!uploadedFile) {
        return res.status(400).send({ error: 'Cover image is required.' });
      }

      const {
        name,
        description,
        requestedFiles,
        price
      } = req.body;

      if (!name || !description || !requestedFiles || !price) {
        return res.status(400).send({ error: 'All fields are required.' });
      }

      const filePath = uploadedFile.path;
      let base64Image = null;
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath);
        base64Image = `data:image/png;base64,${fileData.toString('base64')}`;
      }

      const createdBy = req.user.id;

      const service = await Service.create({
        name,
        description,
        requestedFiles,
        coverImage: base64Image,
        price,
        createdBy
      });

      return res.status(201).json({ message: 'Service created successfully', service });
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

module.exports = {
  createService,
};
