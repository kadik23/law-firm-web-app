require('dotenv').config();
const db = require('../../models');
const path = require('path');
const fs = require('fs');
const {upload} = require("../../middlewares/FilesMiddleware");
const {body, validationResult} = require("express-validator");
const attorneys = db.attorneys;
const User = db.users;

/**
 * @swagger
 * /user/attorneys:
 *   get:
 *     summary: Retrieve a list of all attorneys
 *     description: This endpoint retrieves all attorneys from the database.
 *     tags:
 *       - Attorneys
 *     responses:
 *       200:
 *         description: A list of attorneys
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attorney'
 *       401:
 *         description: Error fetching attorneys
 *       500:
 *         description: Internal Server Error - An error occurred while fetching attorneys
 */


const getAllAttorneys = async (req, res) => {
  try {
    let attorneyList = await attorneys.findAll();

    if (attorneyList) {
      attorneyList = await Promise.all(attorneyList.map(async (attorney) => {
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

      return res.status(200).json(attorneyList);
    } else {
      return res.status(401).send('Error fetching attorneys');
    }
  } catch (e) {
    console.error('Error returning attorneys', e);
    res.status(500).send('Internal Server Error');
  }
};
/**
 * @swagger
 * swagger: '2.0'
 * info:
 *   title: Attorney Update API
 *   description: API for updating attorney information
 *   version: 1.0.0
 * basePath: /user/attorney
 * tags:
 *   - name: Attorneys
 *     description: Operations related to attorneys
 *
 * paths:
 *   /update:
 *     put:
 *       tags:
 *         - Attorneys
 *       summary: Update attorney information
 *       description: Update attorney details, including personal information, LinkedIn URL, and profile picture.
 *       consumes:
 *         - multipart/form-data
 *       produces:
 *         - application/json
 *       parameters:
 *         - name: picture
 *           in: formData
 *           type: file
 *           description: The attorney's profile picture (optional)
 *         - name: id
 *           in: formData
 *           type: integer
 *           required: true
 *           description: The ID of the attorney to update
 *         - name: first_name
 *           in: formData
 *           type: string
 *           description: The attorney's first name (optional)
 *         - name: last_name
 *           in: formData
 *           type: string
 *           description: The attorney's last name (optional)
 *         - name: email
 *           in: formData
 *           type: string
 *           description: The attorney's email address (optional)
 *         - name: password
 *           in: formData
 *           type: string
 *           description: The attorney's password (optional, must be at least 8 characters long)
 *         - name: phone_number
 *           in: formData
 *           type: string
 *           description: The attorney's phone number (optional)
 *         - name: city
 *           in: formData
 *           type: string
 *           description: The attorney's city (optional)
 *         - name: age
 *           in: formData
 *           type: integer
 *           description: The attorney's age (optional, must be at least 18)
 *         - name: sex
 *           in: formData
 *           type: string
 *           enum: [Homme, Femme]
 *           description: The attorney's sex (optional, must be "Homme" or "Femme")
 *         - name: linkedin_url
 *           in: formData
 *           type: string
 *           description: The attorney's LinkedIn URL (optional)
 *         - name: pays
 *           in: formData
 *           type: string
 *           description: The attorney's country (optional)
 *         - name: ville
 *           in: formData
 *           type: string
 *           description: The attorney's city (optional)
 *       responses:
 *         '200':
 *           description: Attorney information updated successfully
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Attorney information updated successfully
 *         '400':
 *           description: Bad request (e.g., validation errors or file upload error)
 *           schema:
 *             type: object
 *             properties:
 *               errors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     msg:
 *                       type: string
 *                       example: Invalid email format
 *                     param:
 *                       type: string
 *                       example: email
 *         '404':
 *           description: Attorney or associated user not found
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Attorney not found
 *         '500':
 *           description: Internal server error
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Failed to update attorney
 */
const uploadFile = upload.single('picture');
const updateAttorney = async (req, res) => {
  try {
    uploadFile(req, res, async (err) => {
      if (err) {
        return res.status(400).send('Error uploading files: ' + err.message);
      }
      await Promise.all([
        body('id').notEmpty().isInt({ min: 0 }).withMessage('Problem id must be a positive integer').run(req),
        body('first_name').optional().isString().withMessage('First name must be a string').run(req),
        body('last_name').optional().isString().withMessage('Last name must be a string').run(req),
        body('email').optional().isEmail().withMessage('Invalid email format').normalizeEmail().run(req),
        body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').run(req),
        body('phone_number').optional().isMobilePhone().withMessage('Invalid phone number format').run(req),
        body('city').optional().isString().withMessage('City must be a string').run(req),
        body('age').optional().isInt({ min: 18 }).withMessage('Age must be a valid number and at least 18').run(req),
        body('sex').optional().isIn(['Homme','Femme']).withMessage('Sex must be "Homme" or "Femme"').run(req),
        body('linkedin_url').optional().isURL().withMessage('Invalid LinkedIn URL').run(req),
        body('pays').optional().isString().withMessage('Pays must be a string').run(req),
      ]);


      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        id,
        first_name,
        last_name,
        email,
        password,
        phone_number,
        city,
        age,
        sex,
        pays,
        ville,
        linkedin_url,
      } = req.body;

      // Find attorney
      const attorney = await attorneys.findOne({ where: { id: id } });
      if (!attorney) {
        return res.status(404).send({ error: 'Attorney not found' });
      }

      // Find associated user
      const user = await User.findOne({ where: { id: attorney.user_id } });
      if (!user) {
        return res.status(404).send({ error: 'Associated user not found' });
      }

      // Handle file upload if a new picture is provided
      let picturePath = attorney.picture_path;
      const uploadedFile = req.file;
      if (uploadedFile) {
        // Delete old picture
        if (picturePath) {
          const oldFilePath = path.resolve(picturePath);
          fs.unlink(oldFilePath, (err) => {
            if (err && err.code !== 'ENOENT') {
              console.error('Error deleting old file:', err);
            }
          });
        }
        picturePath = uploadedFile.path;
      }

      // Update user info
      const updatedUserData = {
        name: first_name || user.name,
        surname: last_name || user.surname,
        email: email || user.email,
        phone_number: phone_number || user.phone_number,
        city: city || user.city,
        age: age || user.age,
        sex: sex || user.sex,
        pays: pays || user.pays,
        ville: ville || user.ville
      };

      // Hash new password if provided
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updatedUserData.password = await bcrypt.hash(password, salt);
      }

      await User.update(updatedUserData, { where: { id: user.id } });

      // Update attorney info
      await attorneys.update(
          {
            linkedin_url: linkedin_url || attorney.linkedin_url,
            picture_path: picturePath
          },
          { where: { id: id } }
      );

      return res.status(200).send({ message: 'Attorney information updated successfully' });
    });
  } catch (error) {
    console.error('Error updating attorney:', error);
    return res.status(500).send({ error: 'Failed to update attorney' });
  }
};


module.exports = {
  getAllAttorneys,
  updateAttorney
};
