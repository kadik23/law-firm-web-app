const { body } = require('express-validator');


const remove=[
body('ids')
    .notEmpty()
    .isArray({ min: 0 })
    .withMessage("ids must be a non-empty array.")
]
module.exports = {  remove };
