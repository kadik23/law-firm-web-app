import { Request, Response } from 'express';
import { db } from '@/models/index';
import { upload } from '@/middlewares/FilesMiddleware';
import { Op, Model, ModelCtor } from 'sequelize';
import { body, validationResult, ValidationError, Result } from 'express-validator';
import { IService } from '@/interfaces/Service';
import fs from 'fs';
import path from 'path';
import { getImagePath } from '@/utils/getImagePath';
import { imageToBase64DataUri } from '@/utils/imageUtils';

const Service: ModelCtor<Model<IService>> = db.services;

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

export const uploadFile = upload.single('coverImage');

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    uploadFile(req, res, async (err: any) => {
      if (err) {
        res.status(400).json({ error: 'Error uploading file: ' + err.message });
        return;
      }
      await Promise.all([
        body('name').isString().notEmpty().withMessage('Name is required.').run(req),
        body('description').isString().notEmpty().withMessage('Description is required.').run(req),
        body('requestedFiles').isArray().notEmpty().withMessage('Requested files are required.').run(req),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number.').run(req),
      ]);
      const errors: Result<ValidationError> = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      if (!req.file) {
        res.status(400).json({ error: 'Cover image is required.' });
        return;
      }
      const { name, description, requestedFiles, price } = req.body;
      const filePath = req.file.path;
      const createdBy = (req as any).user?.id || 'anonymous';
      const service: Model<IService> = await Service.create({
        name,
        description,
        requestedFiles,
        coverImage: filePath,
        price,
        createdBy,
      } as IService);
      const base64Image = imageToBase64DataUri(filePath);
      
      const responseData = {
        ...service.toJSON(),
        coverImage: base64Image
      };
      
      res.status(201).json({ message: 'Service created successfully', service: responseData });
    });
  } catch (error: any) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

/**
 * @swagger
 * /admin/services/delete:
 *   delete:
 *     summary: Delete multiple services
 *     description: Deletes multiple services based on the provided list of IDs.
 *     tags:
 *       - Services
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *             required:
 *               - ids
 *     responses:
 *       200:
 *         description: Successfully deleted the specified services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "3 services deleted"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *                 error:
 *                   type: string
 *                   example: "Error message here"
 */
export const deleteServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;
    const result = await Service.destroy({
      where: { id: { [Op.in]: ids } },
    });
    res.status(200).json({ success: true, message: `${result} services deleted` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const deleteFile = (filePath: string) => {
  if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
  }
};

export const updateService= async (req: Request, res: Response)=>{
  try {
      uploadFile(req, res, async (err: any) => {
          if (err) {
              return res.status(400).json({ error: 'Error uploading files: ' + err.message });
          }
          await Promise.all([
            body("name").isString().optional().run(req),
            body("description").isString().optional().run(req),
            body("requestedFiles").isArray().optional().run(req),
            body("price").optional().isFloat({ gt: 0 }).withMessage("Price must be a positive number.").run(req),
          ]);

          const errors = validationResult(req);
          if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
          }
          const { name, description, requestedFiles, price, id } = req.body;
          const coverImage = req.file;


          const service = await Service.findByPk(id) as Model<IService> & IService | null;
          if (!service) {
              return res.status(404).json({ error: 'Service not found' });
          }

          if (coverImage) {
              deleteFile(service.coverImage);
          }

          const imagePath = coverImage ? coverImage.path : service.coverImage;

          const updatedService = await Service.update(
              { name, description, requestedFiles, coverImage: imagePath, price },
              { where: { id: id } }
          );
          res.status(200).json({ message: 'Service updated successfully', updatedService });
      });
  } catch (error: any) {
      console.error('Error updating service:', error);
      res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

/**
* @swagger
* /admin/services:
*   get:
*     summary: Retrieve a list of services
*     description: Fetches a paginated list of services with optional search and sorting.
*     tags:
*       - Services
*     parameters:
*       - in: query
*         name: page
*         schema:
*           type: integer
*         description: The page number for pagination.
*       - in: query
*         name: limit
*         schema:
*           type: integer
*         description: The number of items per page.
*       - in: query
*         name: sortBy
*         schema:
*           type: string
*         description: The field to sort by (e.g., 'name', 'price').
*       - in: query
*         name: sortOrder
*         schema:
*           type: string
*           enum: [ASC, DESC]
*         description: The sort order.
*       - in: query
*         name: search
*         schema:
*           type: string
*         description: A search term to filter services by name.
*     responses:
*       200:
*         description: A list of services.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 totalServices:
*                   type: integer
*                   example: 100
*                 totalPages:
*                   type: integer
*                   example: 10
*                 currentPage:
*                   type: integer
*                   example: 1
*                 services:
*                   type: array
*                   items:
*                     type: object
*       500:
*         description: Server error
*/
export const getAdminServices = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    const totalServices = await Service.count();

    const totalPages = Math.ceil(totalServices / limit);

    let services = await Service.findAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      raw: false, 
    });

    const servicesWithImages = await Promise.all(
      services.map(async (service) => {
        const serviceData = service.toJSON() as IService;
        const filePath = getImagePath(serviceData.coverImage);
        const base64Image = imageToBase64DataUri(filePath);

        return {
          ...serviceData,
          coverImage: base64Image,
        };
      })
    );

    res.json({
      currentPage: page,
      totalPages,
      totalServices,
      services: servicesWithImages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};