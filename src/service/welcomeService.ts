import WelcomeDTO from "../dto/response/welcome.dto";

export interface WelcomeService {
  hello(): WelcomeDTO;
}

export class WelcomeServiceImpl implements WelcomeService {
  hello() {
    const welcomeDTO = new WelcomeDTO();
    welcomeDTO.message = "Hello World!";

    return welcomeDTO;
  }
}
