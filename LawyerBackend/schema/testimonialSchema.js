const { param, body } = require("express-validator");

const getByService = [
    param('serviceId')
        .isInt({ min: 0 }).withMessage('serviceId must be a positive integer')
];

const add = [
    body("feedback")
        .notEmpty().withMessage("feedback is required")
        .isString().withMessage("feedback must be a string"),

    body("serviceId")
        .notEmpty().withMessage("serviceId is required")
        .isInt().withMessage("serviceId must be a number")
];

const update = [
    param("testimonialId")
        .isInt({ min: 1 }).withMessage("testimonialId must be a positive integer"),

    body("feedback")
        .notEmpty().withMessage("feedback is required")
        .isString().withMessage("feedback must be a string"),
];

const remove = [
    param("testimonialId")
        .isInt({ min: 1 }).withMessage("testimonialId must be a positive integer"),
];

module.exports = { getByService, add, update, remove };
