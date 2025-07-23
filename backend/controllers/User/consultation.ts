import { db } from "@/models/index";
import { Request, Response } from "express";
import { Model, ModelCtor } from "sequelize";
import { IUser } from "@/interfaces/User";
import { IProblem } from "@/interfaces/Problem";
import { IConsultation } from "@/interfaces/Consultation";
import { createNotification } from "@/controllers/createNotification";

const User: ModelCtor<Model<IUser>> = db.users;
const Problem: ModelCtor<Model<IProblem>> = db.problems;
const Consultation: ModelCtor<Model<IConsultation>> = db.Consultation;

/**
 * @swagger
 * /user/consultations:
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
const createConsultation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const client_id = req.user?.id;
    if (!client_id) {
      res.status(401).json({ message: "Unauthorized: Client ID not found." });
      return;
    }
    const {
      problem_id,
      problem_description,
      time,
      date,
      mode,
      meeting_link,
      problem_name,
    } = req.body;
    if (
      !problem_id ||
      !problem_description ||
      !time ||
      !date ||
      !mode ||
      !problem_name
    ) {
      res
        .status(400)
        .json({ message: "All required fields must be provided." });
      return;
    }
    if (!User || !Problem || !Consultation) {
      res
        .status(500)
        .json({ message: "Database models not initialized properly." });
      return;
    }
    const client = await User.findByPk(client_id);
    if (!client) {
      res
        .status(400)
        .json({
          message: `Invalid client_id: No user found with ID ${client_id}.`,
        });
      return;
    }
    const problemEntity = await Problem.findByPk(problem_id);
    if (!problemEntity) {
      res
        .status(400)
        .json({
          message: `Invalid problem_id: No problem found with ID ${problem_id}.`,
        });
      return;
    }
    const newConsultation = await Consultation.create({
      problem_id,
      client_id,
      problem_description,
      problem_name,
      time,
      date,
      mode,
      meeting_link: mode === "online" ? meeting_link : null,
      status: "Pending",
    });
    if (!newConsultation) {
      res.status(401).send("Error creating consultation");
      return;
    } else {
      let notif = await createNotification(
        "Consultation",
        "Vous avez une nouvelle consultation de " + client.getDataValue("name") + client.getDataValue("surname"),
        2,
        newConsultation.getDataValue("id") as number,
        client_id
      );
      if (!notif) {
        res.status(200).send("Consultation created but notification no");
      } else {
        res.status(201).json({
          message: "Consultation created successfully.",
          consultation: newConsultation,
        });
      }
    }
  } catch (error: any) {
    console.error("Error creating consultation:", error);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      res
        .status(400)
        .json({
          message: "Invalid problem_id. Ensure it exists in the database.",
        });
      return;
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMyConsultations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const client_id = req.user?.id;
    if (!client_id) {
      res.status(401).json({ message: "Unauthorized: Client ID not found." });
      return;
    }
    const consultations = await Consultation.findAll({
      where: { client_id },
      order: [
        ["date", "DESC"],
        ["time", "DESC"],
      ],
    });
    res.status(200).json(consultations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching consultations", error });
  }
};

export { createConsultation, getMyConsultations };
