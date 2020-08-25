const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session'); // Handling cookies for signup/signin
const { passwordCompare } = require('./repositories/users.js');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

const app = express();
// Using this use method, all the route handler in our project file can us this bodyParser function.
app.use(express.static('public')); // Express Middleware function that gives access to public files to the requestor.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['asdjsdkjfhkjd6fdds4'],
  })
);
app.use(authRouter);
app.use(productsRouter);

app.listen(3000, () => {
  console.log('Listening...');
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
