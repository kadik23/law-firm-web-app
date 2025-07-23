import { param, body, ValidationChain } from "express-validator";

const getByService: ValidationChain[] = [
    param('serviceId')
        .isInt({ min: 0 }).withMessage('serviceId must be a positive integer')
];

const add: ValidationChain[] = [
    body("feedback")
        .notEmpty().withMessage("feedback is required")
        .isString().withMessage("feedback must be a string"),

    body("serviceId")
        .notEmpty().withMessage("serviceId is required")
        .isInt().withMessage("serviceId must be a number")
];

const update: ValidationChain[] = [
    param("testimonialId")
        .isInt({ min: 1 }).withMessage("testimonialId must be a positive integer"),

    body("feedback")
        .notEmpty().withMessage("feedback is required")
        .isString().withMessage("feedback must be a string"),
];

const remove: ValidationChain[] = [
    param("testimonialId")
        .isInt({ min: 1 }).withMessage("testimonialId must be a positive integer"),
];

export { getByService, add, update, remove };
