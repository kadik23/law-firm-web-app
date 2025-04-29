const db = require("../../models");
const bcrypt = require("bcrypt");
const { upload } = require("../../middlewares/FilesMiddleware");
const path = require("path");
const { Op } = require("sequelize");
const fs = require("fs");
const { body, validationResult } = require("express-validator");

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
const uploadFile = upload.single("picture");

const createAttorney = async (req, res) => {
  try {
    uploadFile(req, res, async (err) => {
      if (err) {
        return res.status(400).send("Error uploading files: " + err.message);
      }

      const uploadedFile = req.file;
      if (!uploadedFile || uploadedFile.length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      await Promise.all([
        body("first_name")
          .notEmpty()
          .withMessage("First name is required")
          .isString()
          .withMessage("First name must be a string")
          .run(req),

        body("last_name")
          .notEmpty()
          .withMessage("Last name is required")
          .isString()
          .withMessage("Last name must be a string")
          .run(req),

        body("email")
          .notEmpty()
          .withMessage("Email is required")
          .isEmail()
          .withMessage("Invalid email format")
          .normalizeEmail()
          .run(req),

        body("password")
          .notEmpty()
          .withMessage("Password is required")
          .isLength({ min: 8 })
          .withMessage("Password must be at least 8 characters long")
          .run(req),

        body("phone_number")
          .optional()
          .isMobilePhone()
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

        body("date_membership")
          .notEmpty()
          .withMessage("Date_membership is required")
          .isISO8601()
          .withMessage("Invalid date format (must be YYYY-MM-DD)")
          .run(req),

        body("pays")
          .notEmpty()
          .withMessage("Pays is required")
          .isString()
          .withMessage("Pays must be a string")
          .run(req),

        body("terms_accepted")
          .notEmpty()
          .withMessage("Terms must be accepted")
          .isBoolean()
          .withMessage("Terms accepted must be true or false")
          .run(req),

        body("status")
          .optional()
          .isString()
          .withMessage("Status must be a string")
          .run(req),
      ]);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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
        status,
      } = req.body;

      if (
        !first_name ||
        !last_name ||
        !email ||
        !password ||
        !linkedin_url ||
        !pays ||
        !terms_accepted ||
        !status
      ) {
        return res.status(400).send({ error: "Missing required fields" });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).send({ error: "Email already in use" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name: first_name,
        surname: last_name,
        email,
        password: hashedPassword,
        phone_number: phone_number,
        city: city,
        age: age,
        sex: sex,
        pays,
        ville: city,
        terms_accepted,
        type: "attorney",
      });

      const newAttorney = await Attorney.create({
        user_id: newUser.id,
        status,
        linkedin_url,
        date_membership: date_membership
          ? new Date(date_membership)
          : new Date(),
        picture_path: uploadedFile.path,
      });

      console.log("Attorney created successfully:", newAttorney);
      return res.status(201).send({
        message: "Attorney created successfully",
        user: newUser,
        attorney: newAttorney,
      });
    });
  } catch (error) {
    console.error("Error creating attorney:", error);
    return res.status(500).send("Failed to create attorney");
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
      attorneys.map(async (attorney) => {
        const filePath = path.resolve(
          __dirname,
          "..",
          "..",
          attorney.picture_path
        );

        let base64Image = null;
        if (fs.existsSync(filePath)) {
          const fileData = fs.readFileSync(filePath);
          base64Image = `data:image/png;base64,${fileData.toString("base64")}`;
        }

        return {
          ...attorney.toJSON(),
          picture: base64Image,
        };
      })
    );

    res.json({
      currentPage: page,
      totalPages,
      totalAttorneys,
      attorneys,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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

    attorneys = await Promise.all(
      attorneys.map(async (attorney) => {
        const filePath = path.resolve(
          __dirname,
          "..",
          "..",
          attorney.picture_path
        );

        let base64Image = null;
        if (fs.existsSync(filePath)) {
          const fileData = fs.readFileSync(filePath);
          base64Image = `data:image/png;base64,${fileData.toString("base64")}`;
        }

        return {
          ...attorney.toJSON(),
          picture: base64Image,
        };
      })
    );

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

const deleteAttorneys = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      await transaction.rollback();
      return res.status(400).send({ error: "Invalid attorney IDs" });
    }

    const attorneys = await Attorney.findAll({
      where: { id: ids },
      include: [{ model: User, as: "User" }],
      transaction,
    });

    if (attorneys.length === 0) {
      await transaction.rollback();
      return res.status(404).send({ error: "No attorneys found" });
    }

    const filePaths = [
      ...new Set(
        attorneys
          .map((attorney) => attorney.picture_path)
          .filter((path) => path)
      ),
    ];

    const fileDeletions = filePaths.map((filePath) => {
      return new Promise((resolve) => {
        const resolvedPath = path.resolve(filePath);
        fs.unlink(resolvedPath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error(`Error deleting file ${filePath}:`, err);
          }
          resolve();
        });
      });
    });

    await Promise.all(fileDeletions);

    const userIds = attorneys
      .map((attorney) => attorney.User?.id)
      .filter((id) => id);

    await Attorney.destroy({
      where: { id: ids },
      transaction,
    });

    if (userIds.length > 0) {
      await User.destroy({
        where: { id: userIds },
        transaction,
      });
    }

    await transaction.commit();
    return res.status(200).send({
      message: "Attorneys and associated users deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting attorneys:", error);
    return res.status(500).send({
      error: "Failed to delete attorneys",
      details: error.message,
    });
  }
};

module.exports = {
  createAttorney,
  deleteAttorneys,
  getAdminAttorneys,
  searchAttorneys,
};
