const express = require("express");
const bodyParser = require("body-parser");
const userRepo = require("./repositories/users.js");

const app = express();
// Using this use method, all the route handler in our project file can us this bodyParser function.
app.use(bodyParser.urlencoded({ extended: true }));

// Route handler
app.get("/", (req, res) => {
  res.send(`
    <div>
        <form method="POST">
            <input name = "email" placeholder = "email" />
            <input name = "password" placeholder = "password" />
            <input name = "passwordConformation" placeholder = "password conformation" />
            <button>Sign up</button>
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
app.post("/", async (req, res) => {
  const { email, password, passwordConformation } = req.body;

  // Checking for existing user.
  const existingUser = await userRepo.getOneBy({ email });
  if (existingUser) {
    return res.send("User already exists");
  }

  // checking for password match.
  if (password !== passwordConformation) {
    return res.send("Password does not match");
  }
  res.send("Account Created");
});

app.listen(3000, () => {
  console.log("Listening...");
});
