import { Request, Response } from "express";
import { db } from "@/models"
import { upload } from "@/middlewares/FilesMiddleware";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import { Model, ModelCtor } from "sequelize";
import { IUser } from '@/interfaces/User';
import { IFile } from '@/interfaces/File';
import { getCookieConfig, getClearCookieConfig } from "../utils/cookieConfig";
dotenv.config();

const users: ModelCtor<Model<IUser>> = db.users;
const files: ModelCtor<Model<IFile>> = db.files;

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
const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      surname,
      email,
      password,
      phone_number,
      pays,
      ville,
      age,
      sex,
      terms_accepted,
    } = req.body;
    if (terms_accepted === false) {
      res.status(401).send("You have to accept the terms");
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
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
      type: "client",
    });
    if (!newUser) {
      res.status(401).send("Error creating user.");
      return;
    }
    const token = jwt.sign({ user: newUser }, process.env.SECRET as string, {
      expiresIn: "7d",
    });
    
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieConfig = getCookieConfig(isProduction);
    
    res.cookie("authToken", token, cookieConfig);
    res
      .status(200)
      .json({ message: "Signed in successfully", type: newUser.getDataValue('type') });
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
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
const addFiles = (req: Request, res: Response): void => {
  uploadFiles(req, res, (err: any): void => {
    if (err) {
      res.status(400).send("Error uploading files: " + err.message);
      return;
    }
    const uploadedFiles = req.files as Express.Multer.File[];
    if (!uploadedFiles || uploadedFiles.length === 0) {
      res.status(400).send("No files were uploaded.");
      return;
    }
    if (!req.user || typeof req.user.id !== 'number') {
      res.status(401).send("Unauthorized: User not found.");
      return;
    }
    const userId = req.user.id;
    const fileRecords: IFile[] = uploadedFiles.map((file) => ({
      path: file.path,
      userId: userId,
    }));
    files.bulkCreate(fileRecords)
      .then(() => {
        res.status(200).json({ message: "Files uploaded successfully", files: fileRecords });
      })
      .catch((error: unknown) => {
        console.error("Error uploading files:", error);
        res.status(500).send("Internal Server Error");
      });
  });
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
const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ where: { email: email } });

    if (!user) {
      res.status(401).send("Invalid email");
      return;
    }
    const userPassword = user.getDataValue('password');
    const userType = user.getDataValue('type');
    const isMatch = await bcrypt.compare(password, userPassword);

    if (!isMatch) {
      res.status(401).send("Invalid password.");
      return;
    }
    const token = jwt.sign(
      { user },
      process.env.SECRET as Secret | jwt.PrivateKey,
      { expiresIn: "7d" }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieConfig = getCookieConfig(isProduction);
    
    res.cookie("authToken", token, cookieConfig);

    res
      .status(200)
      .json({ message: "Signed in successfully", type: userType });
    console.log("Successful sign in");
  } catch (error: unknown) {
    console.error("Error during sign in:", error);
    res.status(500).send("Internal Server Error");
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

const getCurrentClient = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Success fetching user");
    if (!req.user || !req.user.email) {
      res.status(401).send("Unauthorized: User not found");
      return;
    }
    const email = req.user.email;
    const user = await users.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });
    res.status(200).send(user);
  } catch (error: unknown) {
    console.error("Error fetching client:", error);
    res.status(500).send("Internal Server Error");
  }
};

const checkUserAuthentication = async (req: Request, res: Response): Promise<void> => {
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
const logout = (req: Request, res: Response): void => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const clearCookieConfig = getClearCookieConfig(isProduction);
    
    res.clearCookie("authToken", clearCookieConfig);

    res.status(200).json({ message: "Logged out successfully" });
    console.log("User logged out");
  } catch (error: unknown) {
    console.error("Error during logout:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).send("Unauthorized: User not found");
      return;
    }
    const { name, surname, email, phone_number, pays, ville, age, sex } = req.body;
    const user = await users.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    await user.update({
      name: name ?? user.getDataValue('name'),
      surname: surname ?? user.getDataValue('surname'),
      email: email ?? user.getDataValue('email'),
      phone_number: phone_number ?? user.getDataValue('phone_number'),
      pays: pays ?? user.getDataValue('pays'),
      ville: ville ?? user.getDataValue('ville'),
      age: age ?? user.getDataValue('age'),
      sex: sex ?? user.getDataValue('sex'),
    });
    res.status(200).json({ message: "User info updated successfully" });
  } catch (error: unknown) {
    console.error("Error updating user info:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Update admin password
const updateUserPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).send("Unauthorized: User not found");
      return;
    }
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      res.status(400).send("Old and new password are required");
      return;
    }
    const user = await users.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    const isMatch = await bcrypt.compare(oldPassword, user.getDataValue('password'));
    if (!isMatch) {
      res.status(401).send("Invalid old password");
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await user.update({ password: hashedPassword });
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error: unknown) {
    console.error("Error updating user password:", error);
    res.status(500).send("Internal Server Error");
  }
};

export {
  signUp,
  uploadFiles,
  addFiles,
  signIn,
  getCurrentClient,
  checkUserAuthentication,
  logout,
  updateUserInfo,
  updateUserPassword
};
