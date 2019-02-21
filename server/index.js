// Fast, unopinionated, minimalist web framework for node.
const express = require("express");
const volleyball = require("volleyball");
const cors = require("cors");
require("dotenv").config();
//middleware basically intercepts any and all incoming request
const bodyParser = express.json();

const app = express();

const middlewares = require("./auth/middlewares");

const auth = require("./auth/index");
const notes = require("./api/notes");

app.use(volleyball);
app.use(
  cors({
    origin: "http://localhost:8080",
    optionsSuccessStatus: 200
  })
);
app.use(bodyParser);
app.use(middlewares.checkTokenSetUser);

app.get("/", (req, res) => {
  res.json({
    message: "🦄🌈✨Hello World! 🌈✨🦄",
    user: req.user
  });
});

//brought in router, any router inside of auth is pre-pended with /auth
app.use("/auth", auth);
//also this particular middleware function is basically just saying to match any incoming request pre-pended with /auth will be matched

//all the routes inside of the following app.use are protected by middlewares.isLoggedIn
app.use("/api/v1/notes", middlewares.isLoggedIn, notes);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error("Not Found - " + req.originalUrl);
  //next forwards an error
  //next() is a function that tells the code to go on to the NEXT middleware so that it can do its thing
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Listening on port", port);
});

/*if using passport, there is a isLoggedIn built-in function 
need to add passport plugin called Bearer Token that automatically 
takes the token if you want to use jsonwebtokens, it is called http bearer strategy on the passport website
still would need to do token verification
hashing and inserting into db and validation would still need to occur
it really only does the middlewares and making sure that a user is logged in
added benefits - if local auth is hooked up to password
it is that much easier to add oauth google, fb, twitter to app

*/
