require("dotenv").config();
const db = require("../../models");
const { testimonials, users, services } = db;
const { Op } = require("sequelize");

/**
 * @swagger
 * /testimonials:
 *   post:
 *     summary: Add a new testimonial
 *     description: This endpoint allows a user to add a testimonial.
 *     tags:
 *       - Testimonials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feedback:
 *                 type: string
 *                 description: The content of the testimonial
 *                 example: "Great service!"
 *               serviceId:
 *                 type: integer
 *                 description: The service ID associated with the testimonial
 *                 example: 1
 *     responses:
 *       201:
 *         description: Testimonial added successfully
 *       400:
 *         description: Feedback and Service ID are required
 *       500:
 *         description: Internal Server Error
 */
const CreateTestimonial = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User ID is missing." });
    }

    const userId = req.user.id;
    const { feedback, serviceId } = req.body;

    if (!feedback || !serviceId) {
      return res.status(400).json({ message: "Feedback and Service ID are required." });
    }

    const newTestimonial = await testimonials.create({ userId, serviceId, feedback });

    res.status(201).json({
      message: "Testimonial added successfully.",
      testimonial: newTestimonial,
    });
  } catch (error) {
    console.error("❌ Error creating testimonial:", error);
    res.status(500).json({ message: "An error occurred while adding the testimonial.", error: error.message });
  }
};

/**
 * @swagger
 * /testimonials:
 *   get:
 *     summary: Retrieve all testimonials
 *     description: Fetch all testimonials with pagination.
 *     tags:
 *       - Testimonials
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: offset
 *         in: query
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: List of testimonials
 *       500:
 *         description: Internal Server Error
 */
const GetAllTestimonials = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    const testimonialList = await testimonials.findAndCountAll({
      include: [
        { model: users, attributes: ["id", "name"] },
        { model: services, as: "service", attributes: ["id", "name"] }, // Use the correct alias
      ],
      limit,
      offset,
    });

    res.status(200).json({
      total: testimonialList.count,
      testimonials: testimonialList.rows,
    });
  } catch (error) {
    console.error("❌ Error retrieving testimonials:", error);
    res.status(500).json({ 
      message: "An error occurred while retrieving testimonials.", 
      error: error.message 
    });
  }
};

const GetTestimonialsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const testimonialList = await testimonials.findAll({
      where: { serviceId },
      include: [
        { model: users, attributes: ["id", "name"] },
        { model: services, as: "service", attributes: ["id", "name"] },
      ],
    });

    res.status(200).json({
      total: testimonialList.length,
      testimonials: testimonialList,
    });
  } catch (error) {
    console.error("❌ Error retrieving testimonials for service:", error);
    res.status(500).json({ message: "An error occurred while retrieving testimonials.", error: error.message });
  }
};

module.exports = {
  CreateTestimonial,
  GetAllTestimonials,
  GetTestimonialsByService
};
