class UserRepo {
  private data = [
    {
      id: 1,
      username: "test_username_1",
      password: "$2b$10$OMFTAKB5NxkxBOlRVwYB3uRM9hlvHMW8YDw3B/rJZfKo4HN5gXysu", // 12345
      age: 27,
    },
  ];
  findOne(obj) {
    let key, value;

    if (typeof obj == "number") {
      key = "id";
      value = obj;
    } else {
      key = Object.keys(obj)[0];
      value = Object.values(obj)[0];
    }

    const user = this.data.find((item) => item[key] == value);

    if (user) {
      return user;
    }

    return false;
  }

  save(obj) {
    obj.id = 2;
    this.data.push(obj);
  }
}

export default UserRepo;
