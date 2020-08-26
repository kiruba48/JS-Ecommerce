const { validationResult } = require('express-validator');

module.exports = {
  handleErrors(tempFunc) {
    return (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.send(tempFunc({ errors }));
      }

      next();
    };
  },
};
