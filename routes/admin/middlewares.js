const { validationResult } = require('express-validator');

module.exports = {
  handleErrors(tempFunc, productCallback) {
    return async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let data = {};
        if (productCallback) {
          data = await productCallback(req);
        }
        return res.send(tempFunc({ errors, ...data }));
      }

      next();
    };
  },
  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect('/signin');
    }
    next();
  },
};
