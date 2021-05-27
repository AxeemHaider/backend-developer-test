import HttpError from "./httpError";

class BadRequest extends HttpError {
  public statusCode: number = 400;
}

export default BadRequest;
