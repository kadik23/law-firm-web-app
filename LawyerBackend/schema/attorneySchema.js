const { body, query } = require('express-validator');

const add = [
    body('first_name')
        .notEmpty().withMessage('First name is required')
        .isString().withMessage('First name must be a string'),
    
    body('last_name')
        .notEmpty().withMessage('Last name is required')
        .isString().withMessage('Last name must be a string'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

    body('phone_number')
        .optional()
        .isMobilePhone().withMessage('Invalid phone number format'),

    body('city')
        .optional()
        .isString().withMessage('City must be a string'),

    body('age')
        .optional()
        .isInt({ min: 18 }).withMessage('Age must be a valid number and at least 18'),

    body('sex')
        .optional()
        .isIn(['Homme', 'Femme']).withMessage('Sex must be "Homme" or "Femme"'),

    body('linkedin_url')
        .optional()
        .isURL().withMessage('Invalid LinkedIn URL'),

    body('certificats')
        .optional()
        .isString().withMessage('Certificats must be a string'),

    body('date_membership')
        .notEmpty().withMessage('Date_membership is required')
        .isISO8601().withMessage('Invalid date format (must be YYYY-MM-DD)'),

    body('pays')
        .notEmpty().withMessage('Pays is required')
        .isString().withMessage('Pays must be a string'),

    body('terms_accepted')
        .notEmpty().withMessage('Terms must be accepted')
        .isBoolean().withMessage('Terms accepted must be true or false'),

    body('status')
        .optional()
        .isString().withMessage('Status must be a string')
];

const getAttorneys = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer."),
    
    query("search")
        .optional()
        .trim()
        .isString()
        .withMessage("Search must be a string."),
];
const search = [
    query('name')
        .optional()
        .isString().withMessage('Name must be a string')
        .trim()
        .escape(),

    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1 }).withMessage('Limit must be a positive integer')
];
const remove=[
body('ids')
    .notEmpty()
    .isArray({ min: 0 })
    .withMessage("ids must be a non-empty array.")
]

module.exports = { add, getAttorneys, search, remove };
