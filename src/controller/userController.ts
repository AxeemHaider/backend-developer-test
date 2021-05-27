import { Request, Response } from "express";

import RegisterDTO from "../dto/request/register.dto";
import HttpExpress from "../utils/httpExpress";
import BaseController from "./baseController";
import authMiddleware from "../middleware/auth.middleware";
import { UsersService, UsersServiceImpl } from "../service/usersService";
import Database from "../database";
import User from "../entity/User";
import RefreshToken from "../entity/RefreshToken";

class UserController extends BaseController {
  private readonly usersService: UsersService;

  constructor() {
    super();
    const userRepo = Database.getRepository(User);
    const refreshTokenRepo = Database.getRepository(RefreshToken);
    this.usersService = new UsersServiceImpl(userRepo, refreshTokenRepo);
  }

  public initializeEndpoints() {
    this.addAsyncEndpoint("POST", "/register", this.register);
    this.addAsyncEndpoint("GET", "/users/me", this.getMe, authMiddleware);
  }

  public register = async (req: Request, res: Response) => {
    const body: RegisterDTO = req.body;

    const authenticationDTO = await this.usersService.register(body);

    res.status(200).json(authenticationDTO);
  };

  public getMe = async (req: Request, res: Response) => {
    const userId = HttpExpress.getUserIdFromRequest(req);

    const userDTO = await this.usersService.getMe(userId);

    res.status(200).json(userDTO);
  };
}

export default UserController;
