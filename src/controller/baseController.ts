import { NextFunction, Request, Response, Express } from "express";
import HttpExpress from "../utils/httpExpress";

abstract class BaseController {
  private app: Express;

  constructor() {}

  public initializeController(app: Express) {
    this.app = app;
    this.initializeEndpoints();
  }

  protected abstract initializeEndpoints();

  public addEndpoint(
    httpMethod: string,
    route: string,
    fn: (req: Request, res: Response, next?: NextFunction) => any,
    ...middlewares: ((
      req: Request,
      res: Response,
      next?: NextFunction
    ) => any)[]
  ) {
    switch (httpMethod) {
      case "GET":
        middlewares
          ? this.app.get(route, middlewares, fn)
          : this.app.get(route, fn);
        break;
      case "POST":
        middlewares
          ? this.app.post(route, middlewares, fn)
          : this.app.post(route, fn);
        break;
      case "PUT":
        middlewares
          ? this.app.put(route, middlewares, fn)
          : this.app.put(route, fn);
        break;
      case "DELETE":
        middlewares
          ? this.app.delete(route, middlewares, fn)
          : this.app.delete(route, fn);
        break;
    }
  }

  public addAsyncEndpoint(
    httpMethod: string,
    route: string,
    fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>,
    ...middlewares: ((
      req: Request,
      res: Response,
      next?: NextFunction
    ) => any)[]
  ) {
    this.addEndpoint(
      httpMethod,
      route,
      HttpExpress.wrapAsync(fn),
      ...middlewares
    );
  }
}

export default BaseController;
