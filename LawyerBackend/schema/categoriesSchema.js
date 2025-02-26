const {body, param} = require("express-validator");
const getByName = [
    param('name')
        .isString().withMessage('Name must be a string')
        .notEmpty().withMessage('Name is required')

];
const add=[
    body('name')
        .isString().withMessage('Name must be a string')
        .notEmpty().withMessage('Name is required')
]
const remove=[
    body('id')
        .isInt({min:0}).withMessage('ID must be positive number')
        .notEmpty().withMessage('ID is required')
]
module.exports = { getByName,add,remove };