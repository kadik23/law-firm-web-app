require("dotenv").config();
const { sequelize, FreeTime, TimeSlot } = require("../../models");
const ErrorResponse = require("../utils/ErrorResponse");

const validDaysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const convertToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const isSlotValid = (slot) =>
  slot &&
  typeof slot.startHour === "string" &&
  typeof slot.durationMinutes === "number";

const createAvailableTime = async (req, res) => {
  try {
    const attorneyId = req.user?.id;
    if (!attorneyId) {
      return res.status(401).json({ message: "Unauthorized: Attorney ID not found." });
    }

    const { days } = req.body;

    if (!Array.isArray(days) || days.length === 0) {
      return res.status(400).json({ message: "Please provide at least one day with slots." });
    }

    for (const day of days) {
      const { dayOfWeek, slots } = day;

      if (!dayOfWeek || !validDaysOfWeek.includes(dayOfWeek)) {
        return res.status(400).json({ message: `Invalid dayOfWeek: ${dayOfWeek}` });
      }

      if (!Array.isArray(slots) || slots.length === 0) {
        return res.status(400).json({ message: `Slots must be a non-empty array for day ${dayOfWeek}` });
      }

      const slotTimes = [];
      for (const slot of slots) {
        if (!isSlotValid(slot)) {
          return res.status(400).json({ message: `Invalid slot object on ${dayOfWeek}` });
        }

        const startMin = convertToMinutes(slot.startHour);
        const endMin = startMin + slot.durationMinutes;

        if (startMin < 0 || startMin >= 1440 || endMin > 1440) {
          return res.status(400).json({ message: `Slot time out of range on ${dayOfWeek} at ${slot.startHour}` });
        }

        const overlap = slotTimes.some(([s, e]) => startMin < e && endMin > s);
        if (overlap) {
          return res.status(400).json({ message: `Overlapping slot on ${dayOfWeek} at ${slot.startHour}` });
        }

        slotTimes.push([startMin, endMin]);
      }
    }

    const createdDays = await sequelize.transaction(async (t) => {
      const result = [];

      for (const day of days) {
        const { dayOfWeek, slots } = day;

        const exists = await FreeTime.findOne({
          where: { attorneyId, dayOfWeek },
          transaction: t,
        });

        if (exists) {
          throw new Error(`Availability for "${dayOfWeek}" already exists.`);
        }

        const availableDay = await FreeTime.create(
          { attorneyId, dayOfWeek },
          { transaction: t }
        );

        const slotsToCreate = slots.map((slot) => ({
          freeTimeId: availableDay.id,
          startHour: slot.startHour,
          durationMinutes: slot.durationMinutes,
        }));

        await TimeSlot.bulkCreate(slotsToCreate, { transaction: t });

        result.push({
          id: availableDay.id,
          dayOfWeek: availableDay.dayOfWeek,
        });
      }

      return result;
    });

    return res.status(201).json({
      success: true,
      message: "Available times created successfully.",
      data: createdDays,
    });
  } catch (error) {
    console.error("Error creating available time:", error);

    if (error.message?.includes("already exists")) {
      return res.status(400).json({ message: error.message });
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "Invalid foreign key constraint. Check your IDs." });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};
require("dotenv").config();
const { AttorneyAvailableDay, AttorneyAvailableSlot } = require("../models");

const getAllAvailableTimes = async (req, res) => {
  try {
    const availableDays = await AttorneyAvailableDay.findAll({
      include: [{ model: AttorneyAvailableSlot, as: "slots" }],
    });

    return res.status(200).json({ success: true, data: availableDays });
  } catch (error) {
    console.error("Error fetching available times:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteAvailableTimes = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide an array of IDs to delete." });
    }

    await AttorneyAvailableSlot.destroy({
      where: { availableDayId: ids },
    });

    const deletedCount = await AttorneyAvailableDay.destroy({
      where: { id: ids },
    });

    return res.status(200).json({
      success: true,
      message: `${deletedCount} available day(s) deleted.`,
    });
  } catch (error) {
    console.error("Error deleting available times:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createAvailableTime,
    getAllAvailableTimes,
  deleteAvailableTimes,
};
