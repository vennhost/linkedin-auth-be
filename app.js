const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
const path = require("path");
const mongooseConnection = require("./src/db/mongoose");
const passport = require("passport")
const listEndpoints = require("express-list-endpoints");
require("dotenv").config();
const port = process.env.PORT;
mongooseConnection();
const experienceRouter = require("./src/route/experience");
const profileRouter = require("./src/route/profile");
const postRouter = require("./src/route/post");
const userRouter = require("./src/route/auth")
const { basic, adminOnly, setUserInfo } = require("./src/helpers/auth")

app.use(bodyParser.json());

var whitelist = ["http://localhost:3000", "chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop", "http://localhost:3300", "http://localhost:3002", "https://faizanbardai.github.io"];
var corsOptions = {
  origin: function(origin, callback) {
    console.log(origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};
app.use(passport.initialize())
app.use(cors(corsOptions));
app.use("/user", userRouter)

// app.use(express.json());

app.get("/", (req, res) => res.send("LinkedIn Profile"));

/* app.get("/test", basic, setUserInfo, (req, res, next) => {
  res.send("Ok")
});
 */
//server.use("/images", express.static(path.join(__dirname, "images")))
app.use("/images", express.static(path.join(__dirname, "images")))
app.use("/experiences", experienceRouter);
app.use("/profiles", profileRouter);
app.use("/posts", postRouter);

console.log(listEndpoints(app));
app.listen(port, () => console.log(`Your app is listening on port ${port}!`));
