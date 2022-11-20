import express from "express";

const index = express.Router();

index.get("/", function (_req, res) {
  res.send("hello world");
});

export { index };
