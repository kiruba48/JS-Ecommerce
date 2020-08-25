const layout = require('../layout');

const getError = (errors, prop) => {
  try {
    return errors.mapped()[prop].msg; //.mapped() give an object with errors as objects and msg as key values
  } catch (err) {
    return '';
  }
};
module.exports = ({ req, errors }) => {
  return layout({
    content: `
        <div>
            Your ID is: ${req.session.userId}
            <form method="POST">
                <input name = "email" placeholder = "email" />
                ${getError(errors, 'email')}
                <input name = "password" placeholder = "password" />
                ${getError(errors, 'password')}
                <input name = "passwordConformation" placeholder = "password conformation" />
                ${getError(errors, 'PasswordConformation')}
                <button>Sign Up</button>
            </form>
        </div>
`,
  });
};
