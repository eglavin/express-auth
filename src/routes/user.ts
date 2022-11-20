import express from "express";
import { Profile, ProfileSchema } from "../models/Profile";

import { HttpStatusCode } from "../utils/HttpStatusCode";
import { attachUser, jwtMiddleware } from "../utils/Jwt";

const user = express.Router();

user.get("/", jwtMiddleware, attachUser, function (req, res) {
  res.status(HttpStatusCode.OK).json(req.currentUser);
});

user.post("/", jwtMiddleware, attachUser, async function (req, res, next) {
  try {
    const parsedProfile = ProfileSchema.safeParse(req.body);
    if (!parsedProfile.success) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        error: parsedProfile.error,
        status: "Unable to parse profile",
      });
      return;
    }

    const profileRepo = req.context.db?.manager.getRepository(Profile);

    const profileEntity = profileRepo?.create(parsedProfile.data);
    if (!profileEntity) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        status: "Unable to create profile",
      });
      return;
    }

    profileEntity.user = req.currentUser!; // Add user relation to the profile

    const saved = await profileRepo!.save(profileEntity);

    res.status(HttpStatusCode.ACCEPTED).json({
      status: "Profile created",
      profile: saved,
    });
  } catch (error) {
    next(error);
  }
});

export { user };
