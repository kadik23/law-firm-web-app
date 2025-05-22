const db = require('../models')






require("dotenv").config()
const {upload} = require("../middlewares/FilesMiddleware.js");
const fs = require('fs');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const users = db.users
const files = db.files


/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Create a new user and sign them up
 *     description: This endpoint allows a new user to sign up by providing personal information and accepting the terms and conditions.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'  # Reference to the User schema
 *     responses:
 *       200:
 *         description: Success, the user is created and a token is returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token generated for the authenticated user.
 *       400:
 *         description: Bad Request - Missing required fields or invalid data.
 *       401:
 *         description: Unauthorized - The user needs to accept the terms or there is an error in creating the user.
 *       500:
 *         description: Internal Server Error - An error occurred while creating the user.
 */
const signUp = async (req, res) => {
    try {

            const { name, surname, email, password, phone_number, pays, ville, age, sex,terms_accepted } = req.body;

           if(terms_accepted===false){
               return res.status(401).send('You have to accept the terms');
           }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            let newUser = await users.create({
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
                type:"client"
            });

            if (!newUser) {
                return res.status(401).send('Error creating user.');
            }
            console.log(process.env.SECRET)
            const token = jwt.sign({user : newUser}, process.env.SECRET, {expiresIn: "7d"})
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: true, 
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000,
              });
      
            res.status(200).json({ message: 'Signed in successfully', type: newUser.type});
            console.log("Success sign in")
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
};

/**
 * @swagger
 * /files:
 *   post:
 *     summary: Upload multiple files
 *     description: This endpoint allows authenticated users to upload multiple files.
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Files to upload
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Files uploaded successfully"
 *                 files:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/File'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized - Missing Token"
 *       500:
 *         description: Internal Server Error - An error occurred during file upload
 */


const uploadFiles = upload.any();
const addFiles = async (req, res) => {
    try {
        uploadFiles(req, res, async (err) => {
            if (err) {
                return res.status(400).send('Error uploading files: ' + err.message);
            }

            const uploadedFiles = req.files;
            if (!uploadedFiles || uploadedFiles.length === 0) {
                return res.status(400).send('No files were uploaded.');
            }

            const userId = req.user.id;

            const fileRecords = uploadedFiles.map(file => ({
                path: file.path,
                userId: userId,
            }));

            await files.bulkCreate(fileRecords);

            res.status(200).json({ message: 'Files uploaded successfully', files: fileRecords });
        });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).send('Internal Server Error');
    }
};

/**
 * @swagger
 * /user/signin:
 *   post:
 *     summary: Sign in a user
 *     description: This endpoint allows a user to sign in using their email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successful sign in, a token is returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated user
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized - Invalid email or password
 *       500:
 *         description: Internal Server Error - An error occurred during sign in
 */
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({ where: { email:email } });

        if (!user) {
            return res.status(401).send('Invalid email');
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Invalid password.');
        }
        const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: '7d' });

        res.cookie('authToken', token, {
          httpOnly: true,
          secure: true, 
          sameSite: 'strict',
          maxAge: 60 * 60 * 1000,
        });

        res.status(200).json({ message: 'Signed in successfully', type: user.type });
        console.log("Successful sign in");
    } catch (error) {
        console.error('Error during sign in:', error);
        res.status(500).send('Internal Server Error');
    }
};
/**
 * @swagger
 * /user/current:
 *   get:
 *     summary: Get Current User
 *     description: Fetch the details of the currently authenticated client.
 *     tags:
 *       - Client Profile
 *     responses:
 *       '200':
 *         description: Successfully fetched the current user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized - Missing or Invalid Token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Unauthorized - Missing Token
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */

const getCurrentClient = async (req, res) => {
    try {
        console.log("Success fetching user");
        const email = req.user.email;
        const user = await users.findOne({ 
            where: { email },
            attributes: { exclude: ['password'] },
         });
        res.status(200).send(user);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).send('Internal Server Error');
    }
};

const checkUserAuthentication = async (req, res) => {
    res.status(200).send(req.user);
};
/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Logout a user
 *     description: This endpoint allows a user to logout.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful logout
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error - An error occurred during logout
 */
const logout = (req, res) => {
    try {
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        res.status(200).json({ message: 'Logged out successfully' });
        console.log('User logged out');
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    signUp,
    addFiles,
    signIn,
    getCurrentClient,
    checkUserAuthentication,
    logout
};
