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

const remove= [
    body('ids')
    .isArray({ min: 1 }).withMessage('ids must be an array with at least one ID')
    .custom((ids) => ids.every(id => typeof id === 'number'))
    .withMessage('All ids must be numbers')
]

const isLike = [
    param('blogId')
        .isInt({ min: 1 }).withMessage('Blog ID must be a positive integer')
];
module.exports={like,sort,getById,remove, isLike};