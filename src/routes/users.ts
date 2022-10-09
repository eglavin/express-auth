import express from "express";
const users = express.Router();

/* GET users listing. */
users.get("/", function (req, res, next) {
  res.send("hello users");
});

export { users };
