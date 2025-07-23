import { db } from "@/models/index";
import { Request, Response } from "express";
import { Model, ModelCtor } from "sequelize";
import { IAvailableSlot } from "@/interfaces/AvailableSlot";
import { IConsultation } from "@/interfaces/Consultation";

const AvailableSlot: ModelCtor<Model<IAvailableSlot>> = db.AvailableSlot;
const Consultation: ModelCtor<Model<IConsultation>> = db.Consultation;

export const addAvailableSlot = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { day, startTime, endTime } = req.body;
    if (typeof day !== "number" || !startTime || !endTime) {
      res.status(400).json({ message: "Missing required fields." });
    }
    const slot = await AvailableSlot.create({ day, startTime, endTime });
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: "Error creating slot", error });
  }
};

export const removeAvailableSlot = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await AvailableSlot.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: "Slot deleted" });
    } else {
      res.status(404).json({ message: "Slot not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting slot", error });
  }
};

export const getAllAvailableSlots = async (_req: Request, res: Response) => {
  try {
    const slots = await AvailableSlot.findAll();
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching slots", error });
  }
};

export const getAvailableSlotsWithBookings = async (_req: Request, res: Response) => {
  try {
    const slots = await AvailableSlot.findAll();
    const consultations = await Consultation.findAll({ where: { status: "Accepted" } });
    // Build a map: { [slotId]: [bookedDates] }
    const slotBookings = slots.map(slot => {
      // For each slot, find all consultations that match its day and startTime
      const bookedDates = consultations
        .filter(c => {
          const consDate = new Date(c.getDataValue('date'));
          return (
            consDate.getDay() === slot.getDataValue('day') &&
            c.getDataValue('time') === slot.getDataValue('startTime')
          );
        })
        .map(c => c.getDataValue('date'));
      return {
        ...slot.toJSON(),
        bookedDates,
      };
    });
    res.status(200).json(slotBookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching slots with bookings", error });
  }
};
