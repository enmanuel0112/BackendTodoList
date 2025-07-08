"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Task_1 = require("./entity/Task");
const User_1 = require("./entity/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "Cesar",
    password: "8294440426Marisol12",
    database: "TodoList",
    entities: [Task_1.Task, User_1.User],
    logging: true,
    synchronize: true,
});
