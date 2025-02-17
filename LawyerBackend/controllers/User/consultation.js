require("dotenv").config();
const db = require("../../models");
const User = db.users;
const Problem = db.problems;
const Consultation = db.Consultation;
/**
 * @swagger
 * /consultations:
 *   post:
 *     summary: Create a new consultation
 *     description: Clients can create a consultation by providing problem details, date, and mode.
 *     tags:
 *       - Consultations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - problem_id
 *               - client_id
 *               - problem_description
 *               - time
 *               - date
 *               - mode
 *             properties:
 *               problem_id:
 *                 type: string
 *                 example: "1"
 *               client_id:
 *                 type: string
 *                 example: "123"
 *               problem_description:
 *                 type: string
 *                 example: "Need help with legal documentation."
 *               time:
 *                 type: string
 *                 example: "10:00"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-20"
 *               mode:
 *                 type: string
 *                 enum: ["online", "onsite"]
 *                 example: "online"
 *               meeting_link:
 *                 type: string
 *                 nullable: true
 *                 example: "https://meet.example.com/xyz"
 *     responses:
 *       201:
 *         description: Consultation created successfully
 *       400:
 *         description: Bad request, missing required fields
 *       500:
 *         description: Internal Server Error
 */
const createConsultation = async (req, res) => {
  try {
    const { problem_id, client_id, problem_description, time, date, mode, meeting_link } = req.body;

    // Validate required fields
    if (!problem_id || !client_id || !problem_description || !time || !date || !mode) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Ensure models exist before querying
    if (!db.users || !db.problems || !db.Consultation) {
      return res.status(500).json({ message: "Database models not initialized properly." });
    }

    // Check if client exists
    const client = await db.users.findByPk(client_id);
    if (!client) {
      return res.status(400).json({ message: `Invalid client_id: No user found with ID ${client_id}.` });
    }

    // Check if problem exists
    const problem = await db.problems.findByPk(problem_id);
    if (!problem) {
      return res.status(400).json({ message: `Invalid problem_id: No problem found with ID ${problem_id}.` });
    }

    // Create consultation
    const newConsultation = await db.Consultation.create({
      problem_id,
      client_id,
      problem_description,
      time,
      date,
      mode,
      meeting_link: mode === "online" ? meeting_link : null,
      status: "Pending",
    });

    return res.status(201).json({
      message: "Consultation created successfully.",
      consultation: newConsultation,
    });

  } catch (error) {
    console.error("Error creating consultation:", error);

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "Invalid client_id or problem_id. Ensure they exist in the database." });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createConsultation
};
