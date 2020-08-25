const { check } = require('express-validator');
const userRepo = require('../../repositories/users');

module.exports = {
  requireProductName: check('name').trim().isLength({ min: 6, max: 20 }),

  requireProductPrice: check('price').trim().toFloat().isFloat({ min: 1 }),

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
  requireSignInEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid Email')
    .custom(async (email) => {
      const user = await userRepo.getOneBy({ email });
      if (!user) {
        throw new Error('Invalid user email');
      }
    }),
  requireSignInPassword: check('password')
    .trim()
    .custom(async (password, { req }) => {
      const user = await userRepo.getOneBy({ email: req.body.email });
      if (!user) {
        throw new Error('Invalid Password');
      }
      const validPassword = await userRepo.passwordCompare(
        user.password,
        password
      );
      if (!validPassword) {
        throw new Error('Password does not match the login ID');
      }
    }),
};
