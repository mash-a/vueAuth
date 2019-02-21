const express = require("express");
const Joi = require("joi");

const db = require("../db/connection");
const notes = db.get("notes");

const router = express.Router();

const schema = Joi.object().keys({
  title: Joi.string()
    .trim()
    .max(100)
    .required(),
  note: Joi.string()
    .trim()
    .required()
});

router.get("/", (req, res) => {
  console.log(req.user);
  notes
    .find({
      user_id: req.user._id
    })
    .then(notes => {
      res.json(notes);
    });
});

router.post("/", (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    const note = {
      ...req.body,
      user_id: req.user._id
    };
    //insert into db
    notes.insert(note).then(note => {
      return res.json(note);
    });
  } else {
    //send back an error that something not valid was being sent
    const error = new Error(result.error);
    res.status(422);
    delete error.stack;
    next(error);
  }
});

module.exports = router;
