import { expect } from "chai";
import LoginDTO from "../src/dto/request/login.dto";
import RefreshTokenDTO from "../src/dto/request/refreshToken.dto";
import JWT from "../src/security/jwt";
import { AuthService, AuthServiceImpl } from "../src/service/authService";
import RefreshTokenRepo from "./mockRepo/refreshTokenRepo.mock";
import UserRepo from "./mockRepo/userRepo.mock";

const userRepo = new UserRepo();
const refreshTokenRepo = new RefreshTokenRepo();
const authService: AuthService = new AuthServiceImpl(
  userRepo,
  refreshTokenRepo
);

describe("Auth Service", () => {
  describe("Login", () => {
    it("user should able to login", async () => {
      const loginDTO: LoginDTO = new LoginDTO();
      loginDTO.username = "test_username_1";
      loginDTO.password = "12345";

      const authorizationDTO = await authService.login(loginDTO);

      expect(authorizationDTO.token).to.be.not.null;
      expect(authorizationDTO.refreshToken).to.be.not.null;
    });

    it("should not be login if username/password incorrect", async () => {
      const loginDTO: LoginDTO = new LoginDTO();
      loginDTO.username = "test_username_1";
      loginDTO.password = "incorrect-password";

      try {
        await authService.login(loginDTO);
        expect(false).to.true;
      } catch (err) {}
    });
  });

  describe("Refresh Token", () => {
    const expireToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0X3VzZXJuYW1lXzEiLCJpYXQiOjE2MjIxMDEwMjEsImV4cCI6MTYyMjEwMTA4MSwic3ViIjoiMSIsImp0aSI6IjA3N2E1OTllLWIzNzAtNDMyZS04NzZjLWFiOTJhYjFhYmQ4NCJ9.Y59JD6RDBeqbd0R1_BbXDdE8Pvi647TlGposUSaxy7k";
    const refreshToken = "03569099-d335-43ef-b13b-8edded098721";
    let freshToken = { token: "", refreshToken: "" };

    it("should able to refresh access token if expire", async () => {
      const refreshTokenDTO: RefreshTokenDTO = new RefreshTokenDTO();
      refreshTokenDTO.token = expireToken;
      refreshTokenDTO.refreshToken = refreshToken;

      const authorizationDTO = await authService.refreshToken(refreshTokenDTO);

      freshToken.token = authorizationDTO.token;
      freshToken.refreshToken = authorizationDTO.refreshToken;

      expect(authorizationDTO.token).to.be.not.undefined;
      expect(authorizationDTO.refreshToken).to.be.not.undefined;
    });

    it("should not refresh token if access token is not expire", async () => {
      const refreshTokenDTO: RefreshTokenDTO = new RefreshTokenDTO();
      refreshTokenDTO.token = freshToken.token;
      refreshTokenDTO.refreshToken = freshToken.refreshToken;

      try {
        await authService.refreshToken(refreshTokenDTO);
        expect(false).to.true;
      } catch (err) {}
    });

    it("should not grant new token if refresh token not matched", async () => {
      const refreshTokenDTO: RefreshTokenDTO = new RefreshTokenDTO();
      refreshTokenDTO.token = expireToken;
      refreshTokenDTO.refreshToken = freshToken.refreshToken; // wrong refresh token

      try {
        await authService.refreshToken(refreshTokenDTO);
        expect(false).to.true;
      } catch (err) {}
    });

    it("should not refresh is access token is not valid", async () => {
      const refreshTokenDTO: RefreshTokenDTO = new RefreshTokenDTO();
      refreshTokenDTO.token = expireToken.substring(1); // Now its not valid token
      refreshTokenDTO.refreshToken = refreshToken;

      try {
        await authService.refreshToken(refreshTokenDTO);
        expect(false).to.true;
      } catch (err) {}
    });
  });
});
