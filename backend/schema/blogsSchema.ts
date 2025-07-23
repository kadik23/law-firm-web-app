import { body, query, param, ValidationChain } from "express-validator";

const like: ValidationChain[] = [
    body('id')
        .isInt().withMessage("Blog s ID is required")
];

const sort: ValidationChain[] = [
    query('categoryId')
        .optional()
        .isInt({ min: 0 }).withMessage('Category ID must be a positive integer'),

    query('title')
        .optional()
        .isString().withMessage('Title must be a string')
        .isLength({ min: 1 }).withMessage('Title cannot be empty'),

    query('sort')
        .optional()
        .isIn(['new', 'best']).withMessage('Sort must be either "new" or "best"')
];

const getById: ValidationChain[] = [
    param('id')
        .isInt({ min: 0 }).withMessage('Blog ID must be a positive integer')
];

const add: ValidationChain[] = [
    body('title')
        .isString().withMessage('Title must be a string')
        .notEmpty().withMessage('Title is required'),
    body('body')
        .isString().withMessage('Body must be a string')
        .notEmpty().withMessage('Body is required'),
    body('readingDuration')
        .isInt().withMessage('readingDuration must be a number')
        .notEmpty().withMessage('readingDuration is required'),
    body('categoryId')
        .isInt().withMessage('categoryId must be a number')
        .notEmpty().withMessage('categoryId is required')
];
const update: ValidationChain[] = [
    body('title')
        .isString().withMessage('Title must be a string')
        .notEmpty().withMessage('Title is required'),
    body('body')
        .isString().withMessage('Body must be a string')
        .notEmpty().withMessage('Body is required'),
    body('id')
        .isInt().withMessage('id must be a number')
        .notEmpty().withMessage('id is required'),
    body('categoryId')
        .isInt().withMessage('categoryId must be a number')
        .notEmpty().withMessage('categoryId is required')
];

const remove: ValidationChain[] = [
    body('ids')
    .isArray({ min: 1 }).withMessage('ids must be an array with at least one ID')
    .custom((ids: any[]) => ids.every(id => typeof id === 'number'))
    .withMessage('All ids must be numbers')
];

const isLike: ValidationChain[] = [
    param('blogId')
        .isInt({ min: 1 }).withMessage('Blog ID must be a positive integer')
];
export { like, sort, getById, remove, isLike, add, update };