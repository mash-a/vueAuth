// A tiny layer that provides simple yet substantial usability improvements for MongoDB usage within Node.JS.
const monk = require("monk");
const db = monk("localhost/authForNoobs");

module.exports = db;
