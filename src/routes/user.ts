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

    // Add current user to the profile
    profileEntity.account = {
      ...req.currentUser!,
    };

    // Add existing profile id if updating
    if (req.currentUser?.profile?.id) {
      profileEntity.id = req.currentUser.profile.id;
    }

    const saved = await profileRepo?.save(profileEntity);
    if (!saved) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        status: "Unable to save profile",
      });
      return;
    }

    // Remove old profile data from response
    saved.account.profile = null;

    res.status(HttpStatusCode.OK).json({
      status: req.currentUser?.profile?.id ? "Profile updated" : "Profile created",
      data: saved,
    });
  } catch (error) {
    next(error);
  }
});

export { user };
