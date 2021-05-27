import { Request, Response } from "express";
import Database from "../database";
import LoginDTO from "../dto/request/login.dto";
import RefreshTokenDTO from "../dto/request/refreshToken.dto";
import RefreshToken from "../entity/RefreshToken";
import User from "../entity/User";
import JWT from "../security/jwt";
import { AuthService, AuthServiceImpl } from "../service/authService";
import HttpExpress from "../utils/httpExpress";
import BaseController from "./baseController";

class AuthController extends BaseController {
  private readonly authService: AuthService;

  constructor() {
    super();

    const userRepo = Database.getRepository(User);
    const refreshTokenRepo = Database.getRepository(RefreshToken);
    this.authService = new AuthServiceImpl(userRepo, refreshTokenRepo);
  }

  protected initializeEndpoints() {
    this.addAsyncEndpoint("POST", "/login", this.login);
    this.addAsyncEndpoint("POST", "/logout", this.logout);
    this.addAsyncEndpoint("POST", "/refresh/token", this.refreshToken);
  }

  public login = async (req: Request, res: Response) => {
    const body: LoginDTO = req.body;

    const authorizationDTO = await this.authService.login(body);

    res.status(200).json(authorizationDTO);
  };

  public logout = async (req: Request, res: Response) => {
    // Get Token
    const token = HttpExpress.retrieveBearerTokenFromRequest(req);
    // Get Token ID
    const tokenId = JWT.getTokenId(token);

    await this.authService.logout(tokenId);

    res.status(200).json({ message: "You are successfully logged out" });
  };

  public refreshToken = async (req: Request, res: Response) => {
    const body: RefreshTokenDTO = req.body;

    const authorizationDTO = await this.authService.refreshToken(body);

    res.status(200).json(authorizationDTO);
  };
}

export default AuthController;
