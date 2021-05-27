import { NextFunction, Request, Response } from "express";

import Unauthorized from "../error/unauthorized";
import JWT from "../security/jwt";
import HttpExpress from "../utils/httpExpress";

export default function (req: Request, res: Response, next: NextFunction) {
  // retrieve the token
  const token = HttpExpress.retrieveBearerTokenFromRequest(req);

  // Validate the token
  if (!JWT.isValidToken(token)) throw new Unauthorized("Token is not valid");

  // execute next if token is valid
  next();
}
