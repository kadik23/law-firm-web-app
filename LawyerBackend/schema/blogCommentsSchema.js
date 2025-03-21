const {body,query,param} = require("express-validator");

const add = [
    body('body')
        .isString().withMessage('body must be a string')
        .isLength({ min: 1 }).withMessage('body cannot be empty'),
    body('blogId')
        .isInt({ min: 0 }).withMessage('Blog ID must be a positive integer')
];
const remove = [
    param('commentId')
        .isInt().withMessage("Comment s ID is required")
];
const update = [
    body('body')
        .isString().withMessage('body must be a string')
        .isLength({ min: 1 }).withMessage('body cannot be empty'),
    param('commentId')
        .isInt({ min: 0 }).withMessage('ID must be a positive integer')
];
const reply = [
    body('body')
        .isString().withMessage('body must be a string')
        .isLength({ min: 1 }).withMessage('body cannot be empty'),
    body('originalCommentId')
        .isInt({ min: 0 }).withMessage('originalCommentId must be a positive integer')
];
const like = [
    body('id')
        .isInt().withMessage("Comment s ID is required")
];
const getByBlog=[
    param('id')
        .isInt({ min: 0 }).withMessage('Blog ID must be a positive integer')
]

const getByComment=[
    param('commentId')
        .isInt({ min: 0 }).withMessage('Comment ID must be a positive integer')
]
module.exports={add,remove,update,reply,like,getByBlog, getByComment};