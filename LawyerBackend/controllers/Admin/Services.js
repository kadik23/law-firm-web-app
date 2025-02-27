const db = require('../../models');
const { upload } = require('../../middlewares/FilesMiddleware');
const path = require('path');
const fs = require('fs');
const { Op } = require("sequelize");
const { body, validationResult } = require("express-validator");

const Service = db.services;

/**
 * @swagger
 * /admin/services/create:
 *   post:
 *     summary: Create a new service
 *     description: Uploads a cover image and creates a new service entry in the database.
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
 *               - price
 *               - coverImage
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Web Development Service"
 *               description:
 *                 type: string
 *                 example: "A full-stack web development service."
 *               requestedFiles:
 *                 type: string
 *                 example: "requirements.pdf"
 *               price:
 *                 type: number
 *                 example: 499.99
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Service created successfully"
 *                 service:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Web Development Service"
 *                     description:
 *                       type: string
 *                       example: "A full-stack web development service."
 *                     requestedFiles:
 *                       type: string
 *                       example: "requirements.pdf"
 *                     coverImage:
 *                       type: string
 *                       format: base64
 *                     price:
 *                       type: number
 *                       example: 499.99
 *                     createdBy:
 *                       type: integer
 *                       example: 123
 *       400:
 *         description: Invalid input or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "All fields are required."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error: something went wrong"
 */



const uploadFile = upload.single("coverImage");

const createService = async (req, res) => {
  try {
    uploadFile(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "Error uploading file: " + err.message });
      }


      await Promise.all([
        body("name").isString().notEmpty().withMessage("Name is required.").run(req),
        body("description").isString().notEmpty().withMessage("Description is required.").run(req),
        body("requestedFiles").isArray().notEmpty().withMessage("Requested files are required.").run(req),
        body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number.").run(req),
      ]);


      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Cover image is required." });
      }


      const { name, description, requestedFiles, price } = req.body;


      const filePath = req.file.path;

      const createdBy = req.user?.id || "anonymous";

      const service = await Service.create({
        name,
        description,
        requestedFiles,
        coverImage: filePath,
        price,
        createdBy,
      });

      return res.status(201).json({ message: "Service created successfully", service });
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({ error: "Server error: " + error.message });
  }
};
const deleteServices = async (req, res) => {
  try {
    const { ids } = req.body;

    const result = await Service.destroy({
      where: { id: { [Op.in]: ids } },
    });

    res.status(200).json({ success: true, message: `${result} services deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
module.exports = {
  createService,
  deleteServices
};
