import { Request, Response } from 'express';
import { db } from '@/models/index';
import bcrypt from 'bcrypt';
import { upload } from '@/middlewares/FilesMiddleware';
import path from 'path';
import { Op } from 'sequelize';
import fs from 'fs';
import { Model, ModelCtor } from 'sequelize';
import { IAttorney } from '@/interfaces/Attorney';
import { IUser } from '@/interfaces/User';

const User: ModelCtor<Model<IUser>> = db.users;
const Attorney: ModelCtor<Model<IAttorney>> = db.attorneys;
export const uploadFile = upload.single('picture');

/**
 * @swagger
 * paths:
 *   /admin/attorneys/create:
 *     post:
 *       summary: "Create a new attorney"
 *       description: "Create a new attorney account with associated user details."
 *       tags:
 *         - Attorneys
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - first_name
 *                 - last_name
 *                 - email
 *                 - password
 *                 - linkedin_url
 *                 - pays
 *                 - terms_accepted
 *                 - status
 *               properties:
 *                 first_name:
 *                   type: string
 *                   example: "John"
 *                 last_name:
 *                   type: string
 *                   example: "Doe"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "john.doe@example.com"
 *                 password:
 *                   type: string
 *                   format: password
 *                   example: "securepassword123"
 *                 phone_number:
 *                   type: string
 *                   example: "+1234567890"
 *                 city:
 *                   type: string
 *                   example: "New York"
 *                 age:
 *                   type: integer
 *                   example: 35
 *                 sex:
 *                   type: string
 *                   example: "Male"
 *                 linkedin_url:
 *                   type: string
 *                   example: "https://www.linkedin.com/in/johndoe"
 *                 date_membership:
 *                   type: string
 *                   format: date
 *                   example: "2022-01-01"
 *                 pays:
 *                   type: string
 *                   example: "USA"
 *                 terms_accepted:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   example: "Active"
 *       responses:
 *         '201':
 *           description: "Attorney created successfully"
 *         '400':
 *           description: "Bad Request - Missing required fields"
 *         '500':
 *           description: "Internal Server Error"
 */
export const createAttorney = async (req: Request, res: Response): Promise<void> => {
  try {
    await db.sequelize.transaction(async (t) => {
      uploadFile(req, res, async (err: any) => {
        if (err) {
          return res.status(400).json({ error: 'Error uploading files: ' + err.message });
        }
        const { name, surname, email, password, phone_number, pays, ville, age, sex, terms_accepted, date_membership, linkedin_url } = req.body;
        const uploadedFile = req.file;
        if (!name || !surname || !email || !password || !phone_number || !pays || !terms_accepted || !date_membership || !uploadedFile) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
          name,
          surname,
          email,
          password: hashedPassword,
          phone_number,
          pays,
          ville,
          age,
          sex,
          terms_accepted,
          type: 'attorney',
        } as IUser, { transaction: t });
        const newAttorney = await Attorney.create({
          user_id: (newUser as Model<IUser>).getDataValue('id'),
          linkedin_url,
          date_membership,
          picture_path: uploadedFile.path,
        } as IAttorney, { transaction: t });
        res.status(201).json({ user: newUser, attorney: newAttorney });
      });
    });
  } catch (e: any) {
    console.error('Error creating attorney', e);
    res.status(500).json({ error: 'Server error', details: e.message });
  }
};

/**
 * @swagger
 * /admin/attorneys:
 *   get:
 *     summary: Fetch attorneys with pagination and search
 *     description: Allows an admin to fetch attorneys they created, with pagination and optional search by name.
 *     tags:
 *       - Attorneys
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: search
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           example: "John"
 *     responses:
 *       200:
 *         description: Successful response with attorneys and pagination info
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
export const getAdminAttorneys = async (req: Request, res: Response): Promise<void> => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = 6;
    const offset: number = (page - 1) * limit;
    const totalAttorneys: number = await Attorney.count();
    const totalPages: number = Math.ceil(totalAttorneys / limit);
    let attorneys = await Attorney.findAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "surname", "email"],
        },
      ],
    });
    attorneys = await Promise.all(
      attorneys.map(async (attorney: Model<IAttorney>) => {
        const filePath = path.resolve(
          __dirname,
          "..",
          "..",
          (attorney.getDataValue('picture_path') as string)
        );
        let base64Image: string | null = null;
        if (fs.existsSync(filePath)) {
          const fileData = fs.readFileSync(filePath);
          base64Image = `data:image/png;base64,${fileData.toString("base64")}`;
        }
        return {
          ...attorney.toJSON(),
          picture: base64Image,
        } as any;
      })
    );
    res.status(200).json({
      attorneys,
      totalPages,
      currentPage: page,
    });
  } catch (e: any) {
    console.error('Error fetching attorneys', e);
    res.status(500).send('Internal Server Error');
  }
};

export const searchAttorneys = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = 6;
    const offset: number = (page - 1) * limit;
    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { status: { [Op.like]: `%${search}%` } },
        ],
      };
    }
    const { count, rows } = await Attorney.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "surname", "email"],
        },
      ],
    });
    res.status(200).json({
      attorneys: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (e: any) {
    console.error('Error searching attorneys', e);
    res.status(500).send('Internal Server Error');
  }
};

export const deleteAttorneys = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body as { ids: number[] };
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ success: false, message: 'Invalid request, provide an array of IDs' });
      return;
    }
    const attorneysToDelete = await Attorney.findAll({ where: { id: { [Op.in]: ids } } });
    if (attorneysToDelete.length === 0) {
      res.status(404).json({ success: false, message: 'No matching attorneys found' });
      return;
    }
    attorneysToDelete.forEach((attorney: Model<IAttorney>) => {
      const picturePath = attorney.getDataValue('picture_path');
      if (picturePath && fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
      }
    });
    const result = await Attorney.destroy({ where: { id: { [Op.in]: ids } } });
    res.status(200).json({ success: true, message: `${result} attorneys deleted` });
  } catch (e: any) {
    console.error('Error deleting attorneys', e);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
  }
};
