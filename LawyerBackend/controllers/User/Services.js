const db = require('../../models');
const path = require('path');
const fs = require('fs');
const Service = db.services;

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
      order: [['createdAt', 'DESC']], // Trier du plus récent au plus ancien
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
module.exports = {
  getAllServices,
  getOneService
};
