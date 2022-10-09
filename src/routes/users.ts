import express from "express";
import { User } from "../users/entity";
const users = express.Router();

/* GET users listing. */
users.get("/", async function (req, res, next) {
  const userRepo = req.context.db?.manager.getRepository(User);
  const users = await userRepo?.find();
  res.send(users);
});

users.post("/", async function (req, res, next) {
  try {
    const newUser = new User();
    newUser.name = req.body.name;
    newUser.email = req.body.email;

    const saveState = await req.context.db?.manager.save(newUser);

    res.send({
      reqData: saveState,
      success: Boolean(saveState),
    });
  } catch (error) {
    next();
  }
});

export { users };
