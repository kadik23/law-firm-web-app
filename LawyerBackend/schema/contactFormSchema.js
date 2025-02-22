const {body} = require("express-validator");
const add = [
    body('name')
        .isString().withMessage('name must be a string')
        .isLength({ min: 1,max:50 }).withMessage('name cannot be empty'),
    body('surname')
        .isString().withMessage('name must be a string')
        .isLength({ min: 1,max:50 }).withMessage('name cannot be empty'),
    body('email')
        .isEmail().withMessage('Invalid email format')
        .isLength({ min: 1,max:50 }).withMessage('email cannot be empty')
        .normalizeEmail(),
    body('message')
        .isString().withMessage('message must be a string')
        .isLength({ min: 1,max:300 }).withMessage('message cannot be empty'),
];
module.exports={add}