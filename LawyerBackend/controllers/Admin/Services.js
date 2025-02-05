const db = require('../../models');
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - description
 *               - requestedFiles
 *               - coverImage
 *               - price
 *               - createdBy
 *             properties:
 *               id:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
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
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
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
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

module.exports = {
  createService,
};
