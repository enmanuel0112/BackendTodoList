"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.profile = exports.userLogin = exports.registerUser = void 0;
const data_sources_1 = require("../config/data-sources");
const User_1 = require("../entity/User");
const generateJwt_1 = require("../utils/generateJwt");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password } = req.body;
        const existingUser = yield User_1.User.findOneBy({ email });
        const sanitizeUser = (user) => {
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        };
        if (existingUser) {
            res.status(400).json({ error: "User with this email already exists" });
            return;
        }
        const user = new User_1.User();
        user.userName = userName;
        user.email = email;
        user.password = password;
        yield user.save();
        res.status(201).json({
            message: "User created successfully",
            user: sanitizeUser(user),
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.registerUser = registerUser;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield data_sources_1.AppDataSource.getRepository(User_1.User).findOne({
            where: { email },
        });
        const sanitizeUser = (user) => {
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        };
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const isPasswordValid = yield user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid password" });
        }
        const token = (0, generateJwt_1.signAccessToke)({ sub: user.id, email: user.email });
        const isProd = process.env.NODE_ENV === "production";
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: isProd ? "none" : "lax",
            path: "/",
        });
        res.json({
            message: "Login successful",
            userInfo: sanitizeUser(user),
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.userLogin = userLogin;
const profile = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = _req.user.id;
    try {
        const user = yield data_sources_1.AppDataSource.getRepository(User_1.User).findOneBy({
            id: userId,
        });
        const sanitizeUser = (user) => {
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        };
        res.status(201).json({
            user: sanitizeUser(user),
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching users:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.profile = profile;
const logout = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        res.json({ message: "Logout successful" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.logout = logout;
