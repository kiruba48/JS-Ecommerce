const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const userRepo = require('./repositories/users.js');
const { passwordCompare } = require('./repositories/users.js');

const app = express();
// Using this use method, all the route handler in our project file can us this bodyParser function.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['asdjsdkjfhkjd6fdds4'],
  })
);

// Route handler
app.get('/signup', (req, res) => {
  res.send(`
    <div>
      Your ID is: ${req.session.userId}
        <form method="POST">
            <input name = "email" placeholder = "email" />
            <input name = "password" placeholder = "password" />
            <input name = "passwordConformation" placeholder = "password conformation" />
            <button>Sign Up</button>
        </form>
    </div>
  `);
});

// DIY Middleware function to prase the request.
// const bodyParser = (req, res, next) => {
//   if (req.method === "POST") {
//     req.on("data", (data) => {
//       const parsed = data.toString("utf8").split("&");
//       const formData = {};
//       for (let pair of parsed) {
//         const [key, value] = pair.split("=");
//         formData[key] = value;
//       }
//       req.body = formData;
//       next();
//     });
//   } else {
//     next();
//   }
// };

// Using bodyParser Middleware npm library.
app.post('/signup', async (req, res) => {
  const { email, password, passwordConformation } = req.body;

  // Checking for existing user.
  const existingUser = await userRepo.getOneBy({ email });
  if (existingUser) {
    return res.send('User already exists');
  }

  // checking for password match.
  if (password !== passwordConformation) {
    return res.send('Password does not match');
  }

  // Create a user in our repo.
  const user = await userRepo.create({ email, password });

  // Store the Id inside the cookie.(cookie handled using third party library)
  req.session.userId = user.ID; //req.session created by cookie=session library.

  res.send('Account Created');
});

app.get('/signout', (req, res) => {
  req.session = null; //clear out any cookie data that you have.
  res.send('You are signed out');
});

// signIn
app.get('/signin', (req, res) => {
  res.send(`
    <div>
        <form method="POST">
            <input name = "email" placeholder = "email" />
            <input name = "password" placeholder = "password" />
            <button>Sign In</button>
        </form>
    </div>
  `);
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await userRepo.getOneBy({ email });
  // Check for email id.
  if (!user) {
    return res.send('User not found');
  }
  // check for password.
  const validPassword = await userRepo.passwordCompare(user.password, password);
  if (!validPassword) {
    return res.send('Password does not match the login ID');
  }

  req.session.userId = user.ID;
  res.send('You are signed In');
});

app.listen(3000, () => {
  console.log('Listening...');
});
