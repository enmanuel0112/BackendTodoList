import { DataSource } from "typeorm";
import { Task } from "../entity/Task";
import { User } from "../entity/User";
import { env } from "./env";

export const AppDataSource = new DataSource({
  type: env.TYPE as any,
  host: env.HOST,
  port: env.PORT,
  username: env.USERNAME,
  password: env.PASSWORD,
  database: env.DATABASE,
  entities: [Task, User],
  logging: true,
  synchronize: true,
});
