import express from "express";
import http, { Server } from "http";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";

import { index } from "./routes/index";
import { users } from "./routes/users";

dotenv.config();

function createServer(host: string, port: number): Server {
  const app = express();

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "..", "public")));

  // Define routes
  app.use("/", index);
  app.use("/users", users);

  // Catch all and return 500 server error
  app.use(function (_req, res) {
    res.status(500);
    res.send("Internal Server Error");
  });

  return http
    .createServer(app)
    .listen({
      host,
      port,
    })
    .on("listening", function () {
      console.log(`Server is running at http://${host}:${port}`);
    })
    .on("error", function (error) {
      console.log("Server Error");

      if (error.stack) {
        console.log(error.stack);
      }
    });
}

createServer(process.env.HOST || "localhost", Number(process.env.PORT || 3000));
