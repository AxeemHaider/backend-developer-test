import User from "../entity/User";
import UserDTO from "../dto/response/user.dto";

class EntityToDTO {
  public static userToDTO(user: User): UserDTO {
    const userDTO: UserDTO = new UserDTO();
    userDTO.id = user.id;
    userDTO.username = user.username;
    userDTO.age = user.age;

    return userDTO;
  }
}

export default EntityToDTO;
