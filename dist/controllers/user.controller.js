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
exports.deleteUser = exports.updateUser = void 0;
const data_sources_1 = require("../config/data-sources");
const User_1 = require("../entity/User");
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email } = req.body;
        const userId = req.user.id;
        const user = yield data_sources_1.AppDataSource.getRepository(User_1.User).findOneBy({
            id: userId,
        });
        console.log("User found:", user);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        if (userName) {
            user.userName = userName;
        }
        if (email) {
            user.email = email;
        }
        yield user.save();
        const sanitizeUser = (user) => {
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        };
        res.json({
            message: "User updated successfully",
            user: sanitizeUser(user),
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching user by ID:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const result = yield data_sources_1.AppDataSource.getRepository(User_1.User).delete({
            id: userId,
        });
        if (result.affected === 0) {
            res.status(404).json({ error: "User not found" });
        }
        res.status(204).json({ message: "User deleted successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error deleting user:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.deleteUser = deleteUser;
