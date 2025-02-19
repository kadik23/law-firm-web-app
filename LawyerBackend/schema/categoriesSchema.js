const {body, param} = require("express-validator");
const getByName = [
    param('name')
        .isString().withMessage('Name must be a string')
        .notEmpty().withMessage('Name is required')

];module.exports = { getByName };