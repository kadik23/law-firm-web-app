const db = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {upload} = require("../../middlewares/FilesMiddleware");
const fs = require('fs');
const path = require('path');

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
 * paths:
 *   /admin/attorney/delete:
 *     delete:
 *       summary: Delete multiple attorneys
 *       description: Deletes attorneys and their associated users, as well as any uploaded files.
 *       tags:
 *         - Attorneys
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ids:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [1, 2, 3]
 *               required:
 *                 - ids
 *       responses:
 *         200:
 *           description: Attorneys and associated users deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Attorneys and associated users deleted successfully
 *         400:
 *           description: Invalid request (e.g., missing or incorrect attorney IDs)
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Invalid attorney IDs
 *         404:
 *           description: No attorneys found with the given IDs
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: No attorneys found
 *         500:
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Failed to delete attorneys
 *
 */

const deleteAttorneys = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({ error: 'Invalid attorney IDs' });
    }


    const attorneys = await Attorney.findAll({ where: { id: ids } });
    if (attorneys.length === 0) {
      return res.status(404).send({ error: 'No attorneys found' });
    }


    const userIds = attorneys.map(attorney => attorney.user_id);
    const filePaths = attorneys.map(attorney => attorney.picture_path).filter(path => path);


    filePaths.forEach(filePath => {
      const resolvedPath = path.resolve(filePath);
      fs.unlink(resolvedPath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Error deleting file:', err);
        }
      });
    });


    await Attorney.destroy({ where: { id: ids } });


    await User.destroy({ where: { id: userIds } });

    return res.status(200).send({ message: 'Attorneys and associated users deleted successfully' });
  } catch (error) {
    console.error('Error deleting attorneys:', error);
    return res.status(500).send({ error: 'Failed to delete attorneys' });
  }
};

module.exports = { deleteAttorneys };

module.exports = {
  createAttorney,
  deleteAttorneys
};
