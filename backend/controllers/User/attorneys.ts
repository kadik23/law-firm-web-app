import dotenv from "dotenv";
dotenv.config();
import { db } from "@/models"
import path from "path";
import fs from "fs";
import { upload } from "@/middlewares/FilesMiddleware";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Model, ModelCtor } from "sequelize";
import { IAttorney } from "@/interfaces/Attorney";
import { IUser } from "@/interfaces/User";

const attorneys: ModelCtor<Model<IAttorney>> = db.attorneys;
const User: ModelCtor<Model<IUser>> = db.users;

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

const getAllAttorneys = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let attorneyList = await attorneys.findAll();

    if (attorneyList) {
      const resultList: any[] = await Promise.all(
        attorneyList.map(async (attorney: Model<IAttorney>) => {
          const filePath = path.resolve(
            __dirname,
            "..",
            "..",
            attorney.getDataValue('picture_path')
          );

          let base64Image: string | null = null;
          if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath);
            base64Image = `data:image/png;base64,${fileData.toString(
              "base64"
            )}`;
          }

          return {
            ...attorney.toJSON(),
            picture: base64Image,
          };
        })
      );

      res.status(200).json(resultList);
      return;
    } else {
      res.status(401).send("Error fetching attorneys");
      return;
    }
  } catch (e) {
    console.error("Error returning attorneys", e);
    res.status(500).send("Internal Server Error");
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
const uploadFile = upload.single("picture");
const updateAttorney = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    uploadFile(req, res, async (err: any) => {
      if (err) {
        res.status(400).send("Error uploading files: " + err.message);
        return;
      }
      await Promise.all([
        body("first_name")
          .optional()
          .isString()
          .withMessage("First name must be a string")
          .run(req),
        body("last_name")
          .optional()
          .isString()
          .withMessage("Last name must be a string")
          .run(req),
        body("email")
          .optional()
          .isEmail()
          .withMessage("Invalid email format")
          .normalizeEmail()
          .run(req),
        body("phone_number")
          .optional()
          .withMessage("Invalid phone number format")
          .run(req),
        body("city")
          .optional()
          .isString()
          .withMessage("City must be a string")
          .run(req),
        body("age")
          .optional()
          .isInt({ min: 18 })
          .withMessage("Age must be a valid number and at least 18")
          .run(req),
        body("sex")
          .optional()
          .isIn(["Homme", "Femme"])
          .withMessage('Sex must be "Homme" or "Femme"')
          .run(req),
        body("linkedin_url")
          .optional()
          .isURL()
          .withMessage("Invalid LinkedIn URL")
          .run(req),
        body("pays")
          .optional()
          .isString()
          .withMessage("Pays must be a string")
          .run(req),

        body("password")
          .optional()
          .isLength({ min: 8 })
          .withMessage("Password must be at least 8 characters long")
          .custom((value, { req }) => {
            if (value && !req.body.old_password) {
              throw new Error(
                "Old password is required when updating the password"
              );
            }
            return true;
          })
          .run(req),

        body("old_password")
          .optional()
          .custom((value, { req }) => {
            if (req.body.password && !value) {
              throw new Error(
                "Old password is required when updating the password"
              );
            }
            return true;
          })
          .run(req),
      ]);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const {
        first_name,
        last_name,
        email,
        phone_number,
        city,
        age,
        sex,
        pays,
        ville,
        linkedin_url,
        password,
        old_password,
      } = req.body;

      // Find attorney
      const attorney: Model<IAttorney> | null = await attorneys.findOne({
        where: { user_id: req.user?.id },
      });
      if (!attorney) {
        res.status(404).send({ error: "Attorney not found" });
        return;
      }

      // Find associated user
      const user: Model<IUser> | null = await User.findOne({ where: { id: req.user?.id } });
      if (!user) {
        res.status(404).send({ error: "Associated user not found" });
        return;
      }

      // Handle file upload if a new picture is provided
      let picturePath = attorney.getDataValue('picture_path');
      const uploadedFile = req.file;
      if (uploadedFile) {
        // Delete old picture
        if (picturePath) {
          const oldFilePath = path.resolve(picturePath);
          fs.unlink(oldFilePath, (err) => {
            if (err && err.code !== "ENOENT") {
              console.error("Error deleting old file:", err);
            }
          });
        }
        picturePath = uploadedFile.path;
      }
      let hashedPassword = undefined;
      if (password && old_password) {
        const isMatch = await bcrypt.compare(old_password, user.getDataValue('password'));

        if (!isMatch) {
          res.status(401).send("Invalid old password.");
          return;
        }
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
      }
      // Update user info
      const updatedUserData = {
        name: first_name || user.getDataValue('name'),
        surname: last_name || user.getDataValue('surname'),
        email: email || user.getDataValue('email'),
        phone_number: phone_number || user.getDataValue('phone_number'),
        city: ville || (user as any).getDataValue('city'),
        age: age || user.getDataValue('age'),
        sex: sex || user.getDataValue('sex'),
        pays: pays || user.getDataValue('pays'),
        ville: ville || user.getDataValue('ville'),
        password: hashedPassword || user.getDataValue('password'),
      };

      await User.update(updatedUserData, { where: { id: user.getDataValue('id') } });

      // Update attorney info
      await attorneys.update(
        {
          linkedin_url: linkedin_url || attorney.getDataValue('linkedin_url'),
          picture_path: picturePath,
        },
        { where: { id: attorney.getDataValue('id') } }
      );

      res.status(200).send({ message: "Attorney information updated successfully" });
    });
  } catch (error) {
    console.error("Error updating attorney:", error);
    res.status(500).send({ error: "Failed to update attorney" });
  }
};

export { getAllAttorneys, updateAttorney };
