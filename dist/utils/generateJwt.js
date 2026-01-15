"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signRefreshToken = exports.signAccessToke = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../config/jwt");
const crypto_1 = require("crypto");
const signAccessToke = (payload) => {
    return jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.accessSecret, {
        expiresIn: jwt_1.jwtConfig.accessTttl,
        jwtid: (0, crypto_1.randomUUID)(),
        algorithm: "HS256",
    });
};
exports.signAccessToke = signAccessToke;
const signRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.refreshSecret, {
        expiresIn: jwt_1.jwtConfig.refreshTttl,
        jwtid: (0, crypto_1.randomUUID)(),
        algorithm: "HS256",
    });
};
exports.signRefreshToken = signRefreshToken;
