import express from "express";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";

import { Account } from "../models/Account";
import { HttpStatusCode } from "./HttpStatusCode";

const SIGNATURE = process.env.JWT_SIGNATURE as string;
if (!SIGNATURE) {
  throw new Error("JWT_SIGNATURE is unset");
}

export function generateToken(user: Account): string {
  return jwt.sign(
    {
      data: {
        id: user.id,
        email: user.email,
      },
    },
    SIGNATURE,
    {
      expiresIn: "6h",
    }
  );
}

export const jwtMiddleware = expressjwt({
  secret: SIGNATURE,
  requestProperty: "token",
  algorithms: ["HS256"],
  // Assume the JWT will come in through the headers Authorization.
  getToken: function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
      return req.headers.authorization.split(" ")[1];
    }
  },
});

export async function attachUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  const userData = await req.context.db?.manager
    .getRepository(Account)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.profile", "profile")
    .where("email = :id", { id: req.token?.data.email })
    .getOne();

  if (!userData) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      status: "User not found",
    });
    return;
  }

  req.currentUser = {
    id: userData.id,
    email: userData.email,
    profile: userData.profile,
  };

  next();
}
