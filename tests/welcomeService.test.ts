import { expect } from "chai";
import {
  WelcomeService,
  WelcomeServiceImpl,
} from "../src/service/welcomeService";

const welcomeService: WelcomeService = new WelcomeServiceImpl();

describe("Welcome", () => {
  it("should return a message for all user (Public Endpoint)", () => {
    const response = welcomeService.hello();

    expect(response.message).to.be.not.undefined;
  });
});
