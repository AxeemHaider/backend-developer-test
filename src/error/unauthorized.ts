import HttpError from "./httpError";

class Unauthorized extends HttpError {
  public statusCode: number = 401;
}

export default Unauthorized;
