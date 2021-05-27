import { v4 as uuidv4 } from "uuid";

class RefreshTokenRepo {
  private data = [
    {
      user: {
        id: 1,
        username: "test_username_1",
        password:
          "$2b$10$OMFTAKB5NxkxBOlRVwYB3uRM9hlvHMW8YDw3B/rJZfKo4HN5gXysu",
        age: 27,
      },
      jwtId: "077a599e-b370-432e-876c-ab92ab1abd84",
      expiryDate: "2021-06-03T07:37:01.105Z",
      id: "03569099-d335-43ef-b13b-8edded098721",
      invalidated: false,
    },
  ];

  findOne(obj) {
    let key, value;

    if (typeof obj == "string") {
      key = "id";
      value = obj;
    } else {
      key = Object.keys(obj)[0];
      value = Object.values(obj)[0];
    }

    const tokenRecord = this.data.find((item) => item[key] == value);

    if (tokenRecord) {
      return tokenRecord;
    }

    return false;
  }

  save(obj) {
    obj.id = uuidv4();
    this.data.push(obj);
  }
}

export default RefreshTokenRepo;
