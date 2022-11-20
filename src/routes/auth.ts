import express from "express";
import argon2 from "argon2";

import { AccountSchema, Account } from "../models/Account";
import { HttpStatusCode } from "../utils/HttpStatusCode";
import { generateToken } from "../utils/Jwt";

const auth = express.Router();

auth.post("/register", async function (req, res, next) {
  try {
    const parseUser = AccountSchema.safeParse(req.body);
    if (!parseUser.success) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        error: parseUser.error,
        status: "Unable to parse user",
      });
      return;
    }

    const userRepo = req.context.db?.manager.getRepository(Account);

    const existingUser = await userRepo?.findOne({
      where: { email: parseUser.data.email },
    });
    if (existingUser) {
      res.status(HttpStatusCode.CONFLICT).json({
        status: "User already exists",
      });
      return;
    }

    const passwordHashed = await argon2.hash(parseUser.data.password);

    const savedState = await userRepo?.save({
      email: parseUser.data.email,
      password: passwordHashed,
    });

    if (!savedState) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        status: "Unable to save user",
      });
      return;
    }

    res.status(HttpStatusCode.CREATED).json({
      status: "User created",
    });
  } catch (error) {
    next(error);
  }
});

auth.post("/login", async function (req, res, next) {
  try {
    const parseUser = AccountSchema.safeParse(req.body);
    if (!parseUser.success) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        status: parseUser.error,
      });
      return;
    }

    const userRepo = req.context.db?.manager.getRepository(Account);

    const userData = await userRepo?.findOne({
      where: { email: parseUser.data.email },
    });
    if (!userData) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        status: "Login failed",
      });
      return;
    }

    const correctPassword = await argon2.verify(userData.password, parseUser.data.password);
    if (!correctPassword) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        status: "Login failed",
      });
      return;
    }

    res.json({
      status: "Login successful",
      email: userData.email,
      token: generateToken(userData),
    });
  } catch (error) {
    next(error);
  }
});

export { auth };
