const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../db/connection");
//connection to document store
const users = db.get("users");
users.createIndex("username", { unique: true });

//mini express app
const router = express.Router();

const schema = Joi.object().keys({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]+$)/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string()
    .min(10)
    .trim()
    .required()
});

const createTokenSendResponse = (user, res, next) => {
  const payload = {
    _id: user._id,
    username: user.username
  };
  console.log("token secret is", process.env.TOKEN_SECRET);
  //important for the secret to be long to prevent people from guessing the secret and generate fake tokens
  jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1d"
    },
    (err, token) => {
      if (err) {
        respondErr422(res, next);
      } else {
        res.json({ token });
      }
    }
  );
};

router.get("/", (req, res) => {
  res.json({
    message: "Hi from express router auth"
  });
});

const respondErr422 = (res, next) => {
  res.status(422);
  const error = new Error("Unable to login.");
  //deletes the error's stack
  delete error.stack;
  next(error);
};

// POST /signup
router.post("/signup", (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  //Joi returns null when it is validated
  if (result.error === null) {
    //check if username is unique
    users
      .findOne({
        username: req.body.username
      })
      .then(user => {
        //if user is undefined, username is not in the db, otherwise duplicate user detected
        if (user) {
          //then there is a user in db with this username
          //respond with an error
          const error = new Error(
            "Username exists. Please choose another username."
          );
          res.status(409);
          next(error);
        } else {
          //hash password
          //insert user with hashed password
          //can pass a callback function or can do .then
          bcrypt
            .hash(req.body.password.trim(), 12)
            .then(hashedPassword => {
              const newUser = {
                username: req.body.username,
                password: hashedPassword
              };
              users
                .insert(newUser)
                .then(insertedUser => {
                  // delete insertedUser.password;
                  // res.json({ insertedUser });
                  createTokenSendResponse(insertedUser, res, next);
                })
                .catch(err => {
                  console.error(err);
                });
            })
            .catch(err => {
              console.error(err);
            });
        }
      });
  } else {
    res.status(422);
    next(result.error);
  }
});

//POST login method
router.post("/login", (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  //if validated go look for username
  if (result.error === null) {
    users
      .findOne({
        username: req.body.username
      })
      .then(user => {
        if (user) {
          //found user in db  and now compare passwords
          console.log(
            "comparing...",
            req.body.password,
            " with the hash ",
            user.password
          );
          bcrypt.compare(req.body.password, user.password).then(result => {
            if (result) {
              createTokenSendResponse(user, res, next);
            } else {
              respondErr422(res, next);
            }
          });
        } else {
          respondErr422(res, next);
        }
      });
  } else {
    respondErr422(res, next);
  }
});

module.exports = router;
