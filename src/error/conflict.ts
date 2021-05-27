import HttpError from "./httpError";

class Conflict extends HttpError {
  public statusCode: number = 409;
}

export default Conflict;
