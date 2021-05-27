import LoginDTO from "../dto/request/login.dto";
import RefreshTokenDTO from "../dto/request/refreshToken.dto";
import AuthenticationDTO from "../dto/response/authentication.dto";
import RefreshToken from "../entity/RefreshToken";
import User from "../entity/User";
import NotAcceptable from "../error/notAcceptable";
import NotFound from "../error/notFound";
import Unauthorized from "../error/unauthorized";
import JWT from "../security/jwt";
import Password from "../security/password";
import EntityToDTO from "../utils/entityToDTO";

export interface AuthService {
  login(loginDTO: LoginDTO): Promise<AuthenticationDTO>;

  logout(tokenId: string): Promise<void>;

  refreshToken(refreshTokenDTO: RefreshTokenDTO): Promise<AuthenticationDTO>;
}

export class AuthServiceImpl implements AuthService {
  private readonly userRepository;
  private readonly refreshTokenRepository;

  constructor(userRepo, refreshTokenRepo) {
    this.userRepository = userRepo;
    this.refreshTokenRepository = refreshTokenRepo;
  }
  /**
   * Login User
   * @param loginDTO Login DTO
   * @returns Authentication DTO
   */
  async login(loginDTO: LoginDTO): Promise<AuthenticationDTO> {
    // Check if username exist in database
    const user = await this.userRepository.findOne({
      username: loginDTO.username,
    });

    if (!user) throw new NotFound("Username not exist");

    // Check if password is valid
    const isValidPassword = await Password.isValid(
      loginDTO.password,
      user.password
    );
    if (!isValidPassword) throw new Unauthorized("Invalid Password");

    // Generate Authentication Response
    const authenticationDTO: AuthenticationDTO = new AuthenticationDTO();
    authenticationDTO.user = EntityToDTO.userToDTO(user);

    // Generate Token and Refresh Token
    const { token, refreshToken } = await JWT.generateToken(user);
    // Store refresh token in DB
    await this.refreshTokenRepository.save(refreshToken);

    authenticationDTO.token = token;
    authenticationDTO.refreshToken = refreshToken.id;

    return authenticationDTO;
  }

  /**
   * User will no longer create new Access Token
   * from fresh token
   * @param tokenId Access Token ID
   */
  async logout(tokenId: string): Promise<void> {
    // Get refresh token and update it
    const refreshToken = await this.refreshTokenRepository.findOne({
      jwtId: tokenId,
    });

    refreshToken.invalidated = true;

    // store data
    await this.refreshTokenRepository.save(refreshToken);
  }

  /**
   * Generate Access Token from refresh token
   *
   * This method can be implement in different ways according to use case.
   * There are two use cases are discussed.
   * 1 - User should have to login if he/she is inactive for number of days
   * 2 - User should have to re-login after specific number of days
   *
   * In this method the first use case is implement. Only one refresh token
   * point to single unique access token when new access token is generated
   * a new refresh token also generated which is linked to this Access_token
   *
   * Other use case can also be implemented easily instead of creating new refresh
   * token we can update the existing refresh token. If we don't not update the
   * refresh token then there are some security issues we can discuss it if you want
   *
   * @param refreshTokenDTO Refresh Token DTO
   * @returns Authentication DTO
   */
  async refreshToken(
    refreshTokenDTO: RefreshTokenDTO
  ): Promise<AuthenticationDTO> {
    // Check if the token is valid
    if (!JWT.isExpireTokenValid(refreshTokenDTO.token))
      throw new Unauthorized("Access token in not valid");

    // Check token is expire or not if token is not expire
    // then there is no need to create new token
    if (!JWT.isTokenExpire(refreshTokenDTO.token))
      throw new NotAcceptable("Access token is valid no need to refresh it");

    const jwtId = JWT.getTokenId(refreshTokenDTO.token);

    // Fetch refresh token from DB
    const refreshToken = await this.refreshTokenRepository.findOne(
      refreshTokenDTO.refreshToken
    );

    // Check if refresh token exist and linked to token
    const isRefreshTokenLinkedToToken = JWT.isRefreshTokenLinkedToToken(
      refreshToken,
      jwtId
    );

    if (!isRefreshTokenLinkedToToken)
      throw new Unauthorized("Refresh Token is not matched with Access Token");

    // Check if refresh token has expire
    if (JWT.isRefreshTokenExpire(refreshToken))
      throw new Unauthorized("Refresh token has expired");

    // Check if refresh token was used or invalidated
    if (JWT.isRefreshTokenUsedOrInvalidate(refreshToken))
      throw new Unauthorized("Refresh token has been used or invalidate");

    refreshToken.used = true;

    await this.refreshTokenRepository.save(refreshToken);

    // Generate a fresh pair of token and refresh token
    const user = await this.userRepository.findOne(
      JWT.getValueByKey(refreshTokenDTO.token, "id")
    );
    const tokenResults = await JWT.generateToken(user);

    // Store refresh token in DB
    this.refreshTokenRepository.save(tokenResults.refreshToken);

    // Generate Response
    const authenticationDTO: AuthenticationDTO = new AuthenticationDTO();
    authenticationDTO.user = EntityToDTO.userToDTO(user);
    authenticationDTO.token = tokenResults.token;
    authenticationDTO.refreshToken = tokenResults.refreshToken.id;

    return authenticationDTO;
  }
}
