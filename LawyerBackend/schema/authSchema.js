const { body } = require('express-validator');

const signup = [
    body('name')
        .isString()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('surname')
        .isString()
        .notEmpty().withMessage('Surname is required')
        .isLength({ min: 2, max: 50 }).withMessage('Surname must be between 2 and 50 characters'),

    body('email')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .isString()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

    body('phone_number')
        .isMobilePhone().withMessage('Invalid phone number'),

    body('pays')
        .isString()
        .notEmpty().withMessage('Country is required'),

    body('ville')
        .isString()
        .notEmpty().withMessage('City is required'),

    body('age')
        .isInt({ min: 18, max: 100 }).withMessage('Age must be a number between 18 and 100'),

    body('sex')
        .isString()
        .isIn(['Homme','Femme']).withMessage('Sex must be Homme or Femme'),

    body('terms_accepted')
        .isBoolean().withMessage('Terms must be accepted')
];
const uploadFiles = [
    body('file')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('File is required');
            }
            return true;
        }),

    body('file')
        .custom((value, { req }) => {
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (req.file.size > maxSize) {
                throw new Error('File size exceeds 5MB limit');
            }
            return true;
        })
];
const signIn = [
    body('email')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .isString().withMessage('Password must be a string')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];module.exports = { signup,uploadFiles,signIn };
