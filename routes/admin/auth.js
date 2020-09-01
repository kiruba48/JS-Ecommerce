const express = require('express');
const userRepo = require('../../repositories/users.js');

const { handleErrors } = require('./middlewares');
const signupAuth = require('../../HTMLview/admin/authentication/signup');
const signinAuth = require('../../HTMLview/admin/authentication/signin');
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireSignInEmail,
  requireSignInPassword,
} = require('./validator');
const { validationResult } = require('express-validator');

// Creating a express router and hook this router to the express app of index.js file/
const router = express.Router();

// Route handler
router.get('/signup', (req, res) => {
  res.send(signupAuth({ req }));
});

// Using bodyParser Middleware npm library.

router.post(
  '/signup',
  [requireEmail, requirePassword /*requirePasswordConfirmation*/],
  handleErrors(signupAuth),
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.send(signupAuth({ req, errors }));
    // }
    const { email, password } = req.body;
    const user = await userRepo.create({ email, password });

    // Store the Id inside the cookie.(cookie handled using third party library)
    req.session.userId = user.id;

    res.redirect('/admin/products');
  }
);

router.get('/signout', (req, res) => {
  req.session = null; //clear out any cookie data that you have.
  res.send('You are signed out');
});

// signIn
router.get('/signin', (req, res) => {
  res.send(signinAuth({}));
});

router.post(
  '/signin',
  [requireSignInEmail, requireSignInPassword],
  handleErrors(signinAuth),
  async (req, res) => {
    const { email } = req.body;
    const user = await userRepo.getOneBy({ email });

    req.session.userId = user.ID;
    res.redirect('/admin/products');
  }
);

module.exports = router;
