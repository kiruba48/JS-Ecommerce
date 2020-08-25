const { check } = require('express-validator');
const userRepo = require('../../repositories/users');

module.exports = {
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom(async (email) => {
      // Checking for existing user.
      const existingUser = await userRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Must be between 6 and 20'),
  requirePasswordConformation: check('PasswordConformation')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Must be between 6 and 20')
    .custom((passwordConformation, { req }) => {
      if (passwordConformation !== req.body.password) {
        throw new Error('Password does not match');
      }
    }),
};
