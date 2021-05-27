import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import * as moment from "moment";
import { v4 as uuidv4 } from "uuid";

import RefreshToken from "../entity/RefreshToken";
import User from "../entity/User";

dotenv.config();

class JWT {
  private static readonly JWT_SECRET = process.env.JWT_SECRET;

  /**
   * Generate Token and Refresh Token which is linked to it.
   *
   * @param user User
   * @returns token and refresh token
   */
  public static async generateToken(user: User) {
    // Specify a user payload that holds the user id and email
    const payload = {
      id: user.id,
      username: user.username,
    };

    // Generate Token
    const jwtId = uuidv4();
    const token = await jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION, // When does token expire (1hour)
      jwtid: jwtId, // token id require for refreshToken as refreshToken
      // only points to one single unique access token
      subject: user.id.toString(), // refresh token also should only point to single user
    });

    // Generate Refresh Token
    const refreshToken = await this.generateRefreshToken(user, jwtId);

    return { token, refreshToken };
  }

  /**
   * Create Refresh Token to generate a new access token when it expire
   * @param user User
   * @param jwtId Access Token id which will be linked to this refreshToken
   * @returns Refresh Token id
   */
  private static async generateRefreshToken(user: User, jwtId: string) {
    // Create new record of refresh token
    const refreshToken: RefreshToken = new RefreshToken();
    refreshToken.user = user;
    refreshToken.jwtId = jwtId;
    // Set expiration date of refreshToken (7days)
    refreshToken.expiryDate = moment()
      .add(parseInt(process.env.REFRESH_TOKEN_EXPIRATION), "d")
      .toDate();

    return refreshToken;
  }

  /**
   * Check if token is valid or not
   * @param token Access Token
   * @returns True | False
   */
  public static isValidToken(token: string): boolean {
    try {
      jwt.verify(token, this.JWT_SECRET);

      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Check if token is valid it doesn't matter it expire or not
   * @param token Access Token
   * @returns True | False
   */
  public static isExpireTokenValid(token: string): boolean {
    try {
      jwt.verify(token, this.JWT_SECRET, { ignoreExpiration: true });

      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Check if token is expired or not
   * @param token Access Token
   * @returns True | False
   */
  public static isTokenExpire(token: string): boolean {
    const exp = JWT.getValueByKey(token, "exp");

    return Date.now() >= exp * 1000;
  }

  /**
   * Get Access Token id
   * @param token Access token
   * @returns String id of this token which is linked to refresh token
   */
  public static getTokenId(token: string): string {
    const decodedToken = jwt.decode(token);

    return decodedToken["jti"];
  }

  /**
   * Check if Refresh Token is linked to Access Token or not
   * @param refreshToken Refresh Token
   * @param jwtId Access Token id
   * @returns True | False
   */
  public static isRefreshTokenLinkedToToken(
    refreshToken: RefreshToken,
    jwtId: string
  ): boolean {
    // If refresh token and token is not linked
    if (refreshToken.jwtId != jwtId) return false;

    return true;
  }

  /**
   * Check refresh token is expired or not
   * @param refreshToken Refresh Token
   * @returns True | False
   */
  public static isRefreshTokenExpire(refreshToken: RefreshToken): boolean {
    if (moment().isAfter(refreshToken.expiryDate)) return true;

    return false;
  }

  /**
   * Check refresh token used or invalidate
   * @param refreshToken Refresh Token
   * @returns TRUE | FALSE
   */
  public static isRefreshTokenUsedOrInvalidate(
    refreshToken: RefreshToken
  ): boolean {
    return refreshToken.used || refreshToken.invalidated;
  }

  /**
   * Get Value from Access Token by Key name
   * @param token Access Token
   * @param key Key name
   * @returns Value of Key
   */
  public static getValueByKey(token: string, key: string) {
    const decodedToken = jwt.decode(token);
    return decodedToken[key];
  }
}

export default JWT;
