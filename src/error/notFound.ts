import HttpError from "./httpError";

class NotFound extends HttpError {
  public statusCode: number = 404;
}

export default NotFound;
