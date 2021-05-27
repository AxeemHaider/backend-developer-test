import "reflect-metadata";
import * as dotenv from "dotenv";
import * as express from "express";

import AppBuilder from "./appBuilder";
import errorMiddleware from "./middleware/error.middleware";
import WelcomeController from "./controller/welcomeController";
import Database from "./database";
import UserController from "./controller/userController";
import AuthController from "./controller/authController";

dotenv.config();
const app = express();
const appBuilder = new AppBuilder(app);

Database.initialize().then(() => {
  const port = process.env.PORT || "8080";
  const portNumber = parseInt(port);

  appBuilder
    .addMiddleware(express.json())
    .addController(new WelcomeController())
    .addController(new UserController())
    .addController(new AuthController())
    .addMiddleware(errorMiddleware)
    .build(portNumber, () => console.log("Listing on Port", portNumber));
});
