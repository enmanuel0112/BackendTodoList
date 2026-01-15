"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const env_1 = require("./env");
exports.jwtConfig = {
    accessTttl: "1d",
    refreshTttl: "30d",
    accessSecret: env_1.env.JWT_ACCESS_SECRET,
    refreshSecret: env_1.env.JWT_REFRESH_SECRET,
};
