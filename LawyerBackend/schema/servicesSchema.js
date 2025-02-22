const { param, body } = require("express-validator");

const getById = [
  param('id')
    .isInt({ min: 0 }).withMessage('ID must be a positive integer')
];

const add = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isString().withMessage("Name must be a string"),

  body("description")
    .notEmpty().withMessage("Description is required")
    .isString().withMessage("Description must be a string"),

  body("requestedFiles")
    .notEmpty().withMessage("Requested files are required")
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
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 0 }).withMessage("Price must be a valid positive number"),

  body("coverImage")
    .optional()
    .isString().withMessage("Cover image must be a base64 string"),
];

const assignClient = [
  body("clientId")
    .notEmpty().withMessage("clientId is required")
    .isInt({ min: 1 }).withMessage("clientId must be a positive integer"),
    
  body("serviceId")
    .notEmpty().withMessage("serviceId is required")
    .isInt({ min: 1 }).withMessage("serviceId must be a positive integer"),
    
  body("status")
    .optional()
    .isIn(['Completed', 'Pending', 'Canceled']).withMessage("Status must be 'Completed', 'Pending' or 'Canceled'"),
    
  body("is_paid")
    .optional()
    .isBoolean().withMessage("is_paid must be a boolean value"),
];

module.exports = { getById, add, assignClient };
