const {param,body} = require("express-validator");
const getById=[
    param('id')
        .isInt({ min: 0 }).withMessage('ID must be a positive integer')
]

const add = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),

    body("description")
        .notEmpty()
        .withMessage("Description is required")
        .isString()
        .withMessage("Description must be a string"),

    body("requestedFiles")
        .notEmpty()
        .withMessage("Requested files are required")
        .custom((value) => {
            try {
                const parsedValue = JSON.parse(value);
                if (!Array.isArray(parsedValue)) {
                    throw new Error("Requested files must be an array");
                }
                return true;
            } catch (err) {
                throw new Error("Invalid JSON format for requested files");
            }
        }),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a valid positive number"),

    body("coverImage")
        .optional()
        .isString()
        .withMessage("Cover image must be a base64 string"),
];


module.exports={getById,add}