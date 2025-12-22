"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Task_1 = require("../entity/Task");
const User_1 = require("../entity/User");
require("dotenv/config");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.HOST,
    port: parseInt(process.env.PORT || "5432"),
    username: process.env.USERNAME,
    password: `${process.env.PASSWORD_DB}`,
    database: process.env.DATABASE,
    entities: [Task_1.Task, User_1.User],
    logging: true,
    synchronize: true,
});
