import { Connection, createConnection, ObjectType, Repository } from "typeorm";

class Database {
  public static connection: Connection;

  public static async initialize() {
    this.connection = await createConnection();
  }

  public static getRepository<Entity>(
    target: ObjectType<Entity>
  ): Repository<Entity> {
    return this.connection.getRepository(target);
  }
}

export default Database;
