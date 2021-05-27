import * as bcrypt from "bcrypt";

class Password {
  /**
   * Convert Plain Password into Encrypted Password
   * @param plainPassword Plain Password
   * @returns Encrypted Hashed Password
   */
  public static async hash(plainPassword: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    return hashedPassword;
  }

  /**
   * Check password is valid
   * @param plainPassword Plain Password
   * @param hashedPassword Hashed Password
   * @returns True | False
   */
  public static async isValid(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default Password;
