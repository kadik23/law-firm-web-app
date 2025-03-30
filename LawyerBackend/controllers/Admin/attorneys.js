const db = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {upload} = require("../../middlewares/FilesMiddleware");
const path = require('path'); 
const { query, validationResult } = require('express-validator');
const { Op } = require("sequelize");
const fs = require('fs');
const User = db.users;
const Attorney = db.attorneys;

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
 *                 certificats:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Certificate A", "Certificate B"]
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
const uploadFile = upload.single('picture');

const createAttorney = async (req, res) => {
  try {
  uploadFile(req, res, async (err) => {
    if (err) {
      return res.status(400).send('Error uploading files: ' + err.message);
    }

    const uploadedFile = req.file;
    if (!uploadedFile || uploadedFile.length === 0) {
      return res.status(400).send('No files were uploaded.');
    }



  const {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    city,
    age,
    sex,
    linkedin_url,
    certificats,
    date_membership,
    pays,
    terms_accepted,
    status
  } = req.body;

  if (!first_name || !last_name || !email || !password || !linkedin_url || !pays || !terms_accepted || !status) {
    return res.status(400).send({ error: 'Missing required fields' });
  }


    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({ error: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: first_name,
      surname: last_name,
      email,
      password: hashedPassword,
      phone_number: phone_number,
      city: city ,
      age: age,
      sex: sex,
      pays,
      ville: city,
      terms_accepted,
      type: 'attorney'
    });

    const newAttorney = await Attorney.create({
      user_id: newUser.id,
      status,
      linkedin_url,
      certificats: certificats || null,
      date_membership: date_membership ? new Date(date_membership) : new Date(),
      picture_path: uploadedFile.path
    });

    console.log('Attorney created successfully:', newAttorney);
    return res.status(201).send({ message: 'Attorney created successfully', user: newUser, attorney: newAttorney });
  });
  } catch (error) {
    console.error('Error creating attorney:', error);
    return res.status(500).send('Failed to create attorney');
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
const getAdminAttorneys = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = 6;
      const offset = (page - 1) * limit;

      const totalAttorneys = await Attorney.count();

      const totalPages = Math.ceil(totalAttorneys / limit);

      let attorneys = await Attorney.findAll({
          limit,
          offset,
          order: [['createdAt', 'DESC']],
          include: [
            {
                model: User,
                as: "User",
                attributes: ["id", "name", "surname", "email"],
            },
        ],
      });

      attorneys = await Promise.all(attorneys.map(async (attorney) => {
        const filePath = path.resolve(__dirname, '..', '..', attorney.picture_path);

        let base64Image = null;
        if (fs.existsSync(filePath)) {
          const fileData = fs.readFileSync(filePath);
          base64Image = `data:image/png;base64,${fileData.toString('base64')}`;
        }

        return {
          ...attorney.toJSON(),
          picture: base64Image
        };
      }));

      res.json({
          currentPage: page,
          totalPages,
          totalAttorneys,
          attorneys
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};
const searchAttorneys = async (req, res) => {
  try {
      const { name, page = 1, limit = 6 } = req.query;
      const offset = (page - 1) * limit;

      // Build search condition
      const whereCondition = {};
      if (name) {
          whereCondition["$User.name$"] = { [Op.like]: `%${name}%` };
      }

      // Fetch attorneys with pagination and total count
      let { count, rows: attorneys } = await Attorney.findAndCountAll({
          where: whereCondition,
          include: [
              {
                  model: User,
                  as: "User", // Make sure to use the alias from your model associations
                  attributes: ["id", "name", "surname", "email"],
              },
          ],
          limit: parseInt(limit),
          offset: parseInt(offset),
      });

      attorneys = await Promise.all(attorneys.map(async (attorney) => {
        const filePath = path.resolve(__dirname, '..', '..', attorney.picture_path);

        let base64Image = null;
        if (fs.existsSync(filePath)) {
          const fileData = fs.readFileSync(filePath);
          base64Image = `data:image/png;base64,${fileData.toString('base64')}`;
        }

        return {
          ...attorney.toJSON(),
          picture: base64Image
        };
      }));

      return res.json({
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalAttorneys: count,
          attorneys,
      });

  } catch (error) {
      console.error("Error fetching attorneys:", error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createAttorney,
  getAdminAttorneys,
  searchAttorneys
};
