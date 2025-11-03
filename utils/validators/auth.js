// import exporess validator
const { body } = require('express-validator');

// import prisma
const prisma = require('../../prisma/client');

// Definisikan validasi untuk register
const validateRegister = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .custom(async (value) => {
            if (!value) {
                throw new Error('Email is required');
            }

            const user = await prisma.user.findFirst({ where: { email: value, deleted_at: null } });

            if (user) {
                throw new Error('Email already exists');
            }

            return true;
        }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]

// definisikan validasi untuk login
const validateLogin = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
]

module.exports = {
    validateRegister,
    validateLogin
}