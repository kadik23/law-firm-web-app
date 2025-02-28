const {body,query,param} = require("express-validator");

const like = [
    body('id')
        .isInt().withMessage("Blog s ID is required")
];


const sort = [
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


const getById = [
    param('id')
        .isInt({ min: 0 }).withMessage('Blog ID must be a positive integer')
];
const add= [
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
]
const update= [
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
]
const remove= [
    body('id')
        .isInt().withMessage('id must be a number')
        .notEmpty().withMessage('id is required'),
]

const isLike = [
    param('blogId')
        .isInt({ min: 1 }).withMessage('Blog ID must be a positive integer')
];
module.exports={like,sort,getById,add,update,remove, isLike};