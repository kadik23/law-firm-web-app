import { db } from '@/models/index';
import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize';
import { ITestimonial } from '@/interfaces/Testimonial';
import { IUser } from '@/interfaces/User';
import { IService } from '@/interfaces/Service';

const testimonials: ModelCtor<Model<ITestimonial>> = db.testimonials;
const users: ModelCtor<Model<IUser>> = db.users;
const services: ModelCtor<Model<IService>> = db.services;

/**
 * @swagger
 * /user/testimonials:
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
const CreateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Unauthorized: User ID is missing." });
      return;
    }
    const userId = req.user.id;
    const { feedback, serviceId } = req.body;
    if (!feedback || !serviceId) {
      res.status(400).json({ message: "Feedback and Service ID are required." });
      return;
    }
    const newTestimonial = await testimonials.create({ userId, serviceId, feedback });
    res.status(201).json({
      message: "Testimonial added successfully.",
      testimonial: newTestimonial,
    });
  } catch (error: unknown) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({ message: "An error occurred while adding the testimonial.", error: error instanceof Error ? error.message : String(error) });
  }
};

/**
 * @swagger
 * /user/testimonials:
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
const GetAllTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(typeof req.query.limit === 'string' ? req.query.limit : '10', 10) || 10;
    const offset = parseInt(typeof req.query.offset === 'string' ? req.query.offset : '0', 10) || 0;

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
  } catch (error: unknown) {
    console.error("❌ Error retrieving testimonials:", error);
    res.status(500).json({ 
      message: "An error occurred while retrieving testimonials.", 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

const GetTestimonialsByService = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error: unknown) {
    console.error("❌ Error retrieving testimonials for service:", error);
    res.status(500).json({ message: "An error occurred while retrieving testimonials.", error: error instanceof Error ? error.message : String(error) });
  }
};


/**
 * @swagger
 * /user/testimonials/{testimonialId}:
 *   put:
 *     summary: Update a testimonial
 *     description: Allows a user to update their testimonial.
 *     tags:
 *       - Testimonials
 *     parameters:
 *       - in: path
 *         name: testimonialId
 *         required: true
 *         description: The ID of the testimonial to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feedback:
 *                 type: string
 *                 description: The updated feedback.
 *                 example: "Amazing service!"
 *     responses:
 *       200:
 *         description: Testimonial updated successfully.
 *       400:
 *         description: Feedback is required.
 *       403:
 *         description: Unauthorized access.
 *       404:
 *         description: Testimonial not found.
 *       500:
 *         description: Internal server error.
 */
const UpdateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Unauthorized: User ID is missing." });
      return;
    }

    const { testimonialId } = req.params;
    const { feedback } = req.body;
    const userId = req.user.id;

    if (!feedback) {
      res.status(400).json({ message: "Feedback is required." });
      return;
    }

    const testimonial = await testimonials.findByPk(testimonialId);

    if (!testimonial) {
      res.status(404).json({ message: "Testimonial not found." });
      return;
    }

    if (testimonial.getDataValue('userId') !== userId) {
      res.status(403).json({ message: "Unauthorized: You can only update your own testimonial." });
      return;
    }

    testimonial.setDataValue('feedback', feedback);
    await testimonial.save();

    res.status(200).json({ message: "Testimonial updated successfully.", testimonial });

  } catch (error: unknown) {
    console.error("❌ Error updating testimonial:", error);
    res.status(500).json({ message: "An error occurred while updating the testimonial.", error: error instanceof Error ? error.message : String(error) });
  }
};

/**
 * @swagger
 * /user/testimonials/{testimonialId}:
 *   delete:
 *     summary: Delete a testimonial
 *     description: Allows a user to delete their own testimonial.
 *     tags:
 *       - Testimonials
 *     parameters:
 *       - in: path
 *         name: testimonialId
 *         required: true
 *         description: The ID of the testimonial to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Testimonial deleted successfully.
 *       403:
 *         description: Unauthorized access.
 *       404:
 *         description: Testimonial not found.
 *       500:
 *         description: Internal server error.
 */
const DeleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Unauthorized: User ID is missing." });
      return;
    }

    const { testimonialId } = req.params;
    const userId = req.user.id;

    const testimonial = await testimonials.findByPk(testimonialId);

    if (!testimonial) {
      res.status(404).json({ message: "Testimonial not found." });
      return;
    }

    if (testimonial.getDataValue('userId') !== userId) {
      res.status(403).json({ message: "Unauthorized: You can only delete your own testimonial." });
      return;
    }

    await testimonial.destroy();

    res.status(200).json({ message: "Testimonial deleted successfully." });

  } catch (error: unknown) {
    console.error("❌ Error deleting testimonial:", error);
    res.status(500).json({ message: "An error occurred while deleting the testimonial.", error: error instanceof Error ? error.message : String(error) });
  }
};
/**
 * @swagger
 * /user/testimonials/{id}:
 *   get:
 *     summary: Retrieve all testimonials by service id
 *     description: Fetch all testimonials with pagination by service id.
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
 *         description: List of testimonials of service
 *       500:
 *         description: Internal Server Error
 */

export {
  CreateTestimonial,
  GetAllTestimonials,
  GetTestimonialsByService,
  UpdateTestimonial,
  DeleteTestimonial
};