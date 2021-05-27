import Database from "../database";
import RegisterDTO from "../dto/request/register.dto";
import AuthenticationDTO from "../dto/response/authentication.dto";
import UserDTO from "../dto/response/user.dto";
import EntityToDTO from "../utils/entityToDTO";
import User from "../entity/User";
import BadRequest from "../error/badRequest";
import Conflict from "../error/conflict";
import JWT from "../security/jwt";
import Password from "../security/password";

export interface UsersService {
  register(registerDTO: RegisterDTO): Promise<AuthenticationDTO>;
  getMe(userId: string): Promise<UserDTO>;
}

export class UsersServiceImpl implements UsersService {
  private readonly userRepository;
  private readonly refreshTokenRepository;

  constructor(userRepo, refreshTokenRepo) {
    this.userRepository = userRepo;
    this.refreshTokenRepository = refreshTokenRepo;
  }

  /**
   * Register new user
   * @param registerDTO Register DTO
   * @returns Authentication DTO
   */
  async register(registerDTO: RegisterDTO): Promise<AuthenticationDTO> {
    // Password and repeatedPassword must be same
    if (registerDTO.password != registerDTO.repeatedPassword)
      throw new BadRequest("Password and repeatedPassword does not match");

    // check if username is not already exist
    //const userRepository = Database.getRepository(User);
    const usernameExist = await this.userRepository.findOne({
      username: registerDTO.username,
    });
    if (usernameExist) throw new Conflict("Username is already being used");

    // store user data into database
    const user = new User();
    user.username = registerDTO.username;
    user.age = registerDTO.age;
    user.password = await Password.hash(registerDTO.password);

    await this.userRepository.save(user);

    // Generating response
    const authenticationDTO: AuthenticationDTO = new AuthenticationDTO();
    const userDTO: UserDTO = EntityToDTO.userToDTO(user);

    authenticationDTO.user = userDTO;

    // Generate Token and Refresh Token
    const { token, refreshToken } = await JWT.generateToken(user);

    // Store refresh token in DB
    await this.refreshTokenRepository.save(refreshToken);

    authenticationDTO.token = token;
    authenticationDTO.refreshToken = refreshToken.id;

    return authenticationDTO;
  }

  /**
   * Get User info by it's ID
   * @param userId User ID
   * @returns User DTO
   */
  async getMe(userId: string): Promise<UserDTO> {
    // fetch user by its id
    const user = await this.userRepository.findOne(userId);

    return EntityToDTO.userToDTO(user);
  }
}
