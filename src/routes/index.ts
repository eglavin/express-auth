import express from "express";
const index = express.Router();

/* GET home page. */
index.get("/", function (req, res, next) {
  res.send("hello world");
});

export { index };
