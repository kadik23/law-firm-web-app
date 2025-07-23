import { body, query, param, ValidationChain } from "express-validator";

const add: ValidationChain[] = [
    body('body')
        .isString().withMessage('body must be a string')
        .isLength({ min: 1 }).withMessage('body cannot be empty'),
    body('blogId')
        .isInt({ min: 0 }).withMessage('Blog ID must be a positive integer')
];
const remove: ValidationChain[] = [
    param('commentId')
        .isInt().withMessage("Comment s ID is required")
];
const update: ValidationChain[] = [
    body('body')
        .isString().withMessage('body must be a string')
        .isLength({ min: 1 }).withMessage('body cannot be empty'),
    param('commentId')
        .isInt({ min: 0 }).withMessage('ID must be a positive integer')
];
const reply: ValidationChain[] = [
    body('body')
        .isString().withMessage('body must be a string')
        .isLength({ min: 1 }).withMessage('body cannot be empty'),
    body('originalCommentId')
        .isInt({ min: 0 }).withMessage('originalCommentId must be a positive integer')
];
const like: ValidationChain[] = [
    body('id')
        .isInt().withMessage("Comment s ID is required")
];

const isLike: ValidationChain[] = [
    param('commentId')
        .isInt().withMessage("Comment s ID is required")
];

const getByBlog: ValidationChain[] = [
    param('id')
        .isInt({ min: 0 }).withMessage('Blog ID must be a positive integer')
];

const getByComment: ValidationChain[] = [
    param('commentId')
        .isInt({ min: 0 }).withMessage('Comment ID must be a positive integer')
];
export { add, remove, update, reply, like, getByBlog, getByComment, isLike };