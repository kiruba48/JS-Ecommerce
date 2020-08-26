module.exports = {
  getError(errors, prop) {
    try {
      return errors.mapped()[prop].msg; //.mapped() give an object with errors as objects and msg as key values.
      /*errors.mapped() === {
      email: {
        msg:
      },
      password: {
        msg:
      }
      passwordConformation: {
        msg:
      }
    } */
    } catch (err) {
      return '';
    }
  },
};
