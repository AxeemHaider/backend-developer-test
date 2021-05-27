import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";

import Unauthorized from "../error/unauthorized";
import JWT from "../security/jwt";

class HttpExpress {
  /**
   * Check Bearer Token exist and return authorization header
   * @param req Request Object
   * @returns Authorization Header
   */
  public static retrieveBearerTokenFromRequest(req: Request) {
    let authorizationHeader = req.headers.authorization;

    if (!authorizationHeader)
      throw new Unauthorized("Authorization Header is not Set");

    if (authorizationHeader.startsWith("Bearer ")) {
      authorizationHeader = authorizationHeader.substring(
        "Bearer ".length,
        authorizationHeader.length
      );
    }

    return authorizationHeader;
  }

  /**
   * Get Token from request and retrieve user id from it
   * @param req Request Object
   * @returns userId
   */
  public static getUserIdFromRequest(req: Request) {
    // Get token from request
    const token = this.retrieveBearerTokenFromRequest(req);

    // Decode token and get user Id
    return JWT.getValueByKey(token, "id");
  }

  /**
   * Wrap a function to handle Errors from Async methods
   *
   * @param fn Function
   * @returns Function
   */
  public static wrapAsync(
    fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>
  ) {
    return (req: Request, res: Response, next?: NextFunction) => {
      fn(req, res, next).catch(next);
    };
  }
}

export default HttpExpress;
