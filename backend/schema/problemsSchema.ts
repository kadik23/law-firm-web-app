import { param, body, ValidationChain } from "express-validator";

const getByID: ValidationChain[] = [
    param('id')
        .isInt({ min: 0 }).withMessage('id must be a positive integer')
];

const getByCategoryID: ValidationChain[] = [
    param('category_id')
        .isInt({ min: 0 }).withMessage('category id must be a positive integer')
];

const add: ValidationChain[] = [
    body("name")
        .notEmpty()
        .withMessage("name is required")
        .isString()
        .withMessage("name must be a string"),

    body("service_id")
        .notEmpty()
        .withMessage("service_id is required")
        .isInt()
        .withMessage("service_id must be a number"),

    body("category_id")
        .notEmpty()
        .withMessage("category_id is required")
        .isInt()
        .withMessage("category_id must be a number")
];

const remove: ValidationChain[] = [
    param('id')
        .isInt({ min: 0 }).withMessage('id must be a positive integer')
];
export { getByID, add, remove, getByCategoryID };