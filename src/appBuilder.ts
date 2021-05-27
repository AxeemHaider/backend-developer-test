import { NextFunction, Request, Response, Express } from "express";
import BaseController from "./controller/baseController";

type ErrorMiddlewareHandlerType = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

type MiddlewareHandlerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

class AppBuilder {
  constructor(private readonly app: Express) {}

  public addController(controller: BaseController) {
    controller.initializeController(this.app);

    return this;
  }

  public addMiddleware(
    middlewareHandler: MiddlewareHandlerType | ErrorMiddlewareHandlerType
  ) {
    this.app.use(middlewareHandler);

    return this;
  }

  public build(port: number, callback?: () => void) {
    this.app.listen(port, callback);
  }
}

export default AppBuilder;
