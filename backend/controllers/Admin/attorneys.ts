import { Request, Response } from 'express';
import { db } from '@/models/index';
import bcrypt from 'bcrypt';
import { upload, uploadToDrive, getFileBase64FromDrive, deleteFileFromDrive} from '@/middlewares/FilesMiddleware';
import { Op } from 'sequelize';
import { Model, ModelCtor } from 'sequelize';
import { IAttorney } from '@/interfaces/Attorney';
import { IUser } from '@/interfaces/User';
import { body, validationResult, ValidationError, Result } from 'express-validator';
import { imageToBase64DataUri } from '@/utils/imageUtils';

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
    uploadFile(req, res, async (err: any) => {
      if (err) {
        res.status(400).json({ error: 'Error uploading file: ' + err.message });
        return;
      }
      
      await Promise.all([
        body('first_name').isString().notEmpty().withMessage('First name is required.').run(req),
        body('last_name').isString().notEmpty().withMessage('Last name is required.').run(req),
        body('email').isEmail().withMessage('Valid email is required.').run(req),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.').run(req),
        body('phone_number').isString().notEmpty().withMessage('Phone number is required.').run(req),
        body('pays').isString().notEmpty().withMessage('Country is required.').run(req),
        body('ville').isString().notEmpty().withMessage('City is required.').run(req),
        body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100.').run(req),
        body('sex').isString().notEmpty().withMessage('Sex is required.').run(req),
        body('linkedin_url').isURL().withMessage('Valid LinkedIn URL is required.').run(req),
      ]);
      
      const errors: Result<ValidationError> = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      
      if (!req.file) {
        res.status(400).json({ error: 'Profile picture is required.' });
        return;
      }

      const { 
        first_name, 
        last_name, 
        email, 
        password, 
        phone_number, 
        pays, 
        ville, 
        age, 
        sex, 
        linkedin_url
      } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ error: "Email already exists." });
        return;
      }

      const fileId = await uploadToDrive(
        req.file.path,
        req.file.originalname,
        req.file.mimetype
      );
      
      const filePath = req.file.path;
      const formattedDate = new Date().toISOString().split("T")[0];
      
      await db.sequelize.transaction(async (t) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await User.create({
          name: first_name,
          surname: last_name,
          email,
          password: hashedPassword,
          phone_number,
          pays,
          ville,
          age: parseInt(age),
          sex,
          terms_accepted: true,
          type: 'attorney',
        } as IUser, { transaction: t });
        
        const newAttorney = await Attorney.create({
          user_id: (newUser as Model<IUser>).getDataValue('id'),
          linkedin_url,
          date_membership: new Date(formattedDate),
          picture_path: filePath,
          status: 'active',
          file_id: fileId
        } as IAttorney, { transaction: t });
        
        const base64Image = imageToBase64DataUri(filePath);
        
        res.status(201).json({ 
          message: 'Attorney created successfully', 
          attorney: { 
            user: newUser, 
            attorney: {
              ...newAttorney.toJSON(),
              picture: base64Image
            }
          } 
        });
      });
    });
  } catch (error: any) {
    console.error('Error creating attorney:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
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
        let base64Image = null;
        if (attorney.getDataValue('file_id') && attorney.getDataValue('file_id') !== '') {
          base64Image = await getFileBase64FromDrive(attorney.getDataValue('file_id'));
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
    await Promise.all(attorneysToDelete.map(async (attorney: Model<IAttorney>) => {
      if (attorney.getDataValue('file_id') && attorney.getDataValue('file_id') !== '') {
        await deleteFileFromDrive(attorney.getDataValue('file_id'));
      }
    }));
    const result = await Attorney.destroy({ where: { id: { [Op.in]: ids } } });
    res.status(200).json({ success: true, message: `${result} attorneys deleted` });
  } catch (e: any) {
    console.error('Error deleting attorneys', e);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
  }
};
