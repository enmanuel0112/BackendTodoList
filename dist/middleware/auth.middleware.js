"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../config/jwt");
const authMiddleware = (req, res, next) => {
    const token = req.cookies.jwt;
    if (typeof token !== "string") {
        res.status(401).json({
            error: "Authorization header is missing or invalid",
        });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.accessSecret);
        req.user = {
            id: payload.sub,
            email: payload.email,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
};
exports.authMiddleware = authMiddleware;
