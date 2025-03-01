const {param,body} = require("express-validator");
const getById=[
    param('id')
        .notEmpty()
        .isInt({ min: 0 }).withMessage('ID must be a positive integer')
]

const remove=[
    body("ids")
        .notEmpty()
        .isArray({ min: 0 })
        .withMessage("ids must be a non-empty array.")
]

module.exports={getById,remove}