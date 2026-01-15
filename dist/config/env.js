"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
const must = (v, name) => {
    if (!v || v.trim() === "")
        throw new Error(`Missing env: ${name}`);
    return v.trim();
};
exports.env = {
    TYPE: must(process.env.TYPE, "TYPE"),
    JWT_ACCESS_SECRET: must(process.env.JWT_ACCESS_SECRET, "JWT_ACCESS_SECRET"),
    JWT_REFRESH_SECRET: must((_a = process.env.JWT_REFRESH_ACCESS_SECRET) !== null && _a !== void 0 ? _a : process.env.JWT_REFRESH_ACESS_SECRET, "JWT_REFRESH_ACCESS_SECRET (o JWT_REFRESH_ACESS_SECRET)"),
    HOST: must(process.env.HOST, "HOST"),
    PORT: parseInt(must(process.env.PORT, "PORT")),
    USERNAME: must(process.env.DB_USERNAME, "USERNAME"),
    PASSWORD: must(process.env.DB_PASSWORD, "PASSWORD"),
    DATABASE: must(process.env.DB_DATABASE, "DATABASE"),
};
