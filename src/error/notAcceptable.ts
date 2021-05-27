import HttpError from "./httpError";

class NotAcceptable extends HttpError {
  public statusCode: number = 406;
}

export default NotAcceptable;
