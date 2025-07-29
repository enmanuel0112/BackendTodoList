import { DataSource } from 'typeorm';
import { Task } from '../entity/Task';
import { User } from '../entity/User';
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "Cesar",
  password: "8294440426Marisol12",
  database: "TodoList",
  entities: [Task, User],
  logging: true,
  synchronize: true,
})
