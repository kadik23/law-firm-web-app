import { body, ValidationChain } from "express-validator";

const add: ValidationChain[] = [
    body("problem_id").isInt().withMessage("Problem ID must be an integer."),
    body("problem_description")
        .isString()
        .notEmpty()
        .withMessage("Problem description is required."),
    body("time")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Invalid time format. Use HH:MM (24-hour format)."),
    body("date")
        .isISO8601()
        .withMessage("Invalid date format. Use YYYY-MM-DD."),
    body("mode")
        .isIn(["online", "onsite"])
        .withMessage("Mode must be either 'online' or 'onsite'."),
];

export { add };
