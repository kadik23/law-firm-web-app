const db = require('../../models');
<<<<<<< HEAD
const { upload } = require('../../middlewares/FilesMiddleware');
const path = require('path');
const fs = require('fs');

=======
>>>>>>> af101a2bbc2b378d5f72c10187f83b1ce341ca7f
const Service = db.services;

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a new service
 *     description: Create a new service in the system.
 *     tags:
 *       - Services
 *     requestBody:
 *       required: true
 *       content:
<<<<<<< HEAD
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
=======
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
>>>>>>> af101a2bbc2b378d5f72c10187f83b1ce341ca7f
 *               - name
 *               - description
 *               - requestedFiles
 *               - coverImage
 *               - price
 *               - createdBy
 *             properties:
<<<<<<< HEAD
=======
 *               id:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
>>>>>>> af101a2bbc2b378d5f72c10187f83b1ce341ca7f
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
<<<<<<< HEAD
 *                 format: binary
 *               price:
 *                 type: string
 *                 example: "199.99"
 *     responses:
 *       201:
 *         description: Service created successfully
=======
 *                 example: "https://example.com/image.jpg"
 *               price:
 *                 type: string
 *                 example: "199.99"
 *               createdBy:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
>>>>>>> af101a2bbc2b378d5f72c10187f83b1ce341ca7f
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
<<<<<<< HEAD

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
=======
const createService = async (req, res) => {
  try {
    const { id, name, description, requestedFiles, coverImage, price } = req.body;
    const createdBy = req.user.id;

    if (!id || !name || !description || !requestedFiles || !coverImage || !price) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const service = await Service.create({
      id,
      name,
      description,
      requestedFiles,
      coverImage,
      price,
      createdBy,
    });


    return res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Validation error: ' + error.errors.map(err => err.message).join(', ') });
    }
>>>>>>> af101a2bbc2b378d5f72c10187f83b1ce341ca7f
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

module.exports = {
  createService,
};
