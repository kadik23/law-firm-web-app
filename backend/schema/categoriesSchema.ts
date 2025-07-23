import { body, param, ValidationChain } from "express-validator";

const getByName: ValidationChain[] = [
    param('name')
        .isString().withMessage('Name must be a string')
        .notEmpty().withMessage('Name is required')
];
const add: ValidationChain[] = [
    body('name')
        .isString().withMessage('Name must be a string')
        .notEmpty().withMessage('Name is required')
];
const remove: ValidationChain[] = [
    body('id')
        .isInt({min:0}).withMessage('ID must be positive number')
        .notEmpty().withMessage('ID is required')
];
export { getByName, add, remove };