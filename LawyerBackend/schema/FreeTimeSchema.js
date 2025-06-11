const { body } = require("express-validator");

const validDaysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const isValidTimeFormat = (value) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

const createAvailableTime = [
  body("days")
    .isArray({ min: 1 })
    .withMessage("days must be a non-empty array")
    .bail(),

  body("days.*.dayOfWeek")
    .isString()
    .trim()
    .bail()
    .custom(value => {
      if (!validDaysOfWeek.includes(value)) {
        throw new Error("dayOfWeek must be a valid day name (Monday to Sunday)");
      }
      return true;
    }),

  body("days.*.slots")
    .isArray({ min: 1 })
    .withMessage("slots must be a non-empty array")
    .bail(),

  body("days.*.slots.*.startHour")
    .isString()
    .trim()
    .bail()
    .custom(value => {
      if (!isValidTimeFormat(value)) {
        throw new Error("startHour must be a valid time string in HH:mm format");
      }
      return true;
    }),

  body("days.*.slots.*.durationMinutes")
    .isInt({ min: 1 })
    .withMessage("durationMinutes must be a positive integer"),
];

const deleteAvailableTimes = [
  body("ids")
    .isArray({ min: 1 })
    .withMessage("ids must be a non-empty array")
    .bail(),

  body("ids.*")
    .isInt({ min: 1 })
    .withMessage("each id must be a positive integer"),
];

module.exports = {
  createAvailableTime,
  deleteAvailableTimes,
};
