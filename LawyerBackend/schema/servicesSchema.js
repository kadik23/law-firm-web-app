const {param} = require("express-validator");
const getById=[
    param('id')
        .isInt({ min: 0 }).withMessage('ID must be a positive integer')
]
module.exports={getById}