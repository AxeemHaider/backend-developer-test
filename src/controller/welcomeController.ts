import { Request, Response } from "express";

import BaseController from "./baseController";
import { WelcomeService, WelcomeServiceImpl } from "../service/welcomeService";

class WelcomeController extends BaseController {
  private readonly welcomeService: WelcomeService;

  constructor() {
    super();
    this.welcomeService = new WelcomeServiceImpl();
  }

  protected initializeEndpoints() {
    this.addEndpoint("GET", "/welcome", this.welcome);
  }

  public welcome = (req: Request, res: Response) => {
    const message = this.welcomeService.hello();

    res.status(200).json(message);
  };
}

export default WelcomeController;
