const {param,body} = require("express-validator");
const getByID=[
    param('id')
        .isInt({ min: 0 }).withMessage('id must be a positive integer')
]

const add = [
    body("name")
        .notEmpty()
        .withMessage("name is required")
        .isString()
        .withMessage("name must be a string"),

    body("service_id")
        .notEmpty()
        .withMessage("service_id is required")
        .isInt()
        .withMessage("service_id must be a number"),

    body("category_id")
        .notEmpty()
        .withMessage("category_id is required")
        .isInt()
        .withMessage("category_id must be a number")
];

const remove=[
    param('id')
        .isInt({ min: 0 }).withMessage('id must be a positive integer')
]
module.exports={getByID,add,remove}