const jwt = require("jsonwebtoken");

function checkTokenSetUser(req, res, next) {
  const authHeader = req.get("authorization");
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
        if (error) {
          console.error(error);
        }
        req.user = user;
        console.log("line 13 checktokensetuser", req.user, user);
        next();
      });
    } else {
      //CONTINUE ONWARDS TO NEXT MIDDLEWARE
      next();
    }
  } else {
    //onwards to next middleware or can halt the process and forward an error
    next();
  }
}

//bearer is just a convention and is conventionally used to prepend a token

function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    const error = new Error("Un-Authorized");
    res.status(401);
    next(error);
  }
}

module.exports = {
  checkTokenSetUser,
  isLoggedIn
};
