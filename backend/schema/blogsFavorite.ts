import { body, query, param, ValidationChain } from "express-validator";

const add: ValidationChain[] = [
    body('blogId')
        .isInt().withMessage("Blog s ID is required")
];
const remove: ValidationChain[] = [
    param('id')
        .isInt().withMessage("Favorite s ID is required")
];

const search: ValidationChain[] = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer')
        .toInt(),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
        .toInt(),

    query('q')
        .optional()
        .isString().withMessage('Search query must be a string')
        .isLength({ min: 1 }).withMessage('Search query cannot be empty'),
];

const isFavorite: ValidationChain[] = [
    param('blogId')
        .isInt({ min: 1 }).withMessage('Blog ID must be a positive integer')
];
export { add, remove, search, isFavorite };