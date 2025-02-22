const {param,body} = require("express-validator");
const getByService=[
    param('serviceId')
        .isInt({ min: 0 }).withMessage('serviceId must be a positive integer')
]

const add = [
    body("feedback")
        .notEmpty()
        .withMessage("feedback is required")
        .isString()
        .withMessage("feedback must be a string"),

    body("serviceId")
        .notEmpty()
        .withMessage("serviceId is required")
        .isInt()
        .withMessage("serviceId must be a number")
];


module.exports={getByService,add}