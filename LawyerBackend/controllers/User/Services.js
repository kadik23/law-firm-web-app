const db = require('../../models');
const Service = db.services;

/**
 * @swagger
 * /services:
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
 *                     format: uuid
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
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
 *                     example: "https://example.com/image.jpg"
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
    const services = await Service.findAll();

    if (services.length === 0) {
      return res.status(404).json({ message: 'No services found.' });
    }

    return res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);

    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

module.exports = {
  getAllServices,
};
