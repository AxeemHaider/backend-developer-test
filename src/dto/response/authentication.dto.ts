import UserDTO from "./user.dto";

class AuthenticationDTO {
    token: string;
    refreshToken: string;
    user: UserDTO;
}

export default AuthenticationDTO;