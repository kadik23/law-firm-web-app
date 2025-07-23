import { db } from "@/models/index";
import { Request, Response } from "express";
import { Model, ModelCtor } from "sequelize";
import { IConsultation } from "@/interfaces/Consultation";
import { IProblem } from "@/interfaces/Problem";
import { generateJitsiMeetLink } from "@/utils/jitsiMeet";
import { createNotification } from "@/controllers/createNotification";

const Consultation: ModelCtor<Model<IConsultation>> = db.Consultation;
const Problem: ModelCtor<Model<IProblem>> = db.problems;

export const getAllConsultations = async (_req: Request, res: Response) => {
  try {
    const consultations = await Consultation.findAll({
      include: [
        {
          model: Problem,
          attributes: ["id", "name"],
          as: "problem",
        },
        {
          model: db.users,
          attributes: ["id", "name", "surname", "phone_number"],
          as: "client",
        },
      ],
    });
    res.status(200).json(consultations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching consultations", error });
  }
};

export const updateConsultation = async (req: Request, res: Response) => {
  const t = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const { status, meeting_link } = req.body;
    const consultation = await Consultation.findByPk(id, { transaction: t });
    if (!consultation) {
      await t.rollback();
      res.status(404).json({ message: "Consultation not found" });
      return;
    }
    const mode = consultation.getDataValue("mode");
    if (status === "Accepted" && mode === "online") {
      const jitsiLink = generateJitsiMeetLink();
      consultation.set("status", status);
      consultation.set("meeting_link", jitsiLink);
    } else if (status === "Pending" || status === "Canceled") {
      consultation.set("status", status);
      consultation.set("meeting_link", "");
    } else {
      if (status) consultation.set("status", status);
      if (meeting_link) consultation.set("meeting_link", meeting_link);
    }
    await consultation.save({ transaction: t });
    await t.commit();
    let notif = await createNotification(
      "Consultation",
      "Votre consultation a été mise à jour en" + status,
      consultation.getDataValue("client_id") as number,
      consultation.getDataValue("id") as number,
      2
    );
    if (!notif) {
      res.status(200).send("Consultation updated but notification no");
    } else {
      res.status(200).json(consultation);
    }
  } catch (error) {
    await t.rollback();
    console.error("Error updating consultation:", error);
    res.status(500).json({ message: "Error updating consultation", error });
  }
};
