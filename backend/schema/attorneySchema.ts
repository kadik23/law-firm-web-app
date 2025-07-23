import { body, query, ValidationChain } from 'express-validator';

const getAttorneys: ValidationChain[] = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer."),
    
    query("search")
        .optional()
        .trim()
        .isString()
        .withMessage("Search must be a string."),
];
const search: ValidationChain[] = [
    query('name')
        .optional()
        .isString().withMessage('Name must be a string')
        .trim()
        .escape(),

    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1 }).withMessage('Limit must be a positive integer')
];
const remove: ValidationChain[] = [
  body('ids')
    .notEmpty()
    .isArray({ min: 0 })
    .withMessage("ids must be a non-empty array.")
];

export { getAttorneys, search, remove };
