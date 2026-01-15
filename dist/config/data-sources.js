"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Task_1 = require("../entity/Task");
const User_1 = require("../entity/User");
const env_1 = require("./env");
exports.AppDataSource = new typeorm_1.DataSource({
    type: env_1.env.TYPE,
    host: env_1.env.HOST,
    port: env_1.env.PORT,
    username: env_1.env.USERNAME,
    password: env_1.env.PASSWORD,
    database: env_1.env.DATABASE,
    entities: [Task_1.Task, User_1.User],
    logging: true,
    synchronize: true,
});
