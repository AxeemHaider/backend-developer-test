import { expect } from "chai";
import RegisterDTO from "../src/dto/request/register.dto";
import JWT from "../src/security/jwt";

import { UsersService, UsersServiceImpl } from "../src/service/usersService";
import RefreshTokenRepo from "./mockRepo/refreshTokenRepo.mock";
import UserRepo from "./mockRepo/userRepo.mock";

let accessToken;
const userRepo = new UserRepo();
const refreshTokenRepo = new RefreshTokenRepo();
const usersService: UsersService = new UsersServiceImpl(
  userRepo,
  refreshTokenRepo
);

describe("User Service", () => {
  it("should able to register a user", async () => {
    const registerDTO: RegisterDTO = new RegisterDTO();
    registerDTO.username = "test_username";
    registerDTO.age = 27;
    registerDTO.password = "12345";
    registerDTO.repeatedPassword = "12345";

    const authenticationDTO = await usersService.register(registerDTO);

    accessToken = authenticationDTO.token;

    expect(authenticationDTO.token).to.be.not.null;
    expect(authenticationDTO.refreshToken).to.be.not.null;
    expect(authenticationDTO.user.username).to.eq(registerDTO.username);
    expect(authenticationDTO.user.age).to.eq(registerDTO.age);
  });

  it("should able to get user data", async () => {
    const userId = JWT.getValueByKey(accessToken, "id");
    const userDTO = await usersService.getMe(userId);

    expect(userDTO.id).to.eq(userId);
    expect(userDTO.age).to.eq(27);
    expect(userDTO.username).to.eq("test_username");
  });
});
