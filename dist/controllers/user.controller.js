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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUsers = exports.createUser = void 0;
const User_1 = require("../entity/User");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, password } = req.body;
    const user = new User_1.User();
    user.userName = userName;
    user.email = email;
    user.password = password;
    yield user.save()
        .then(() => console.log('done'))
        .catch((error) => console.error('Error creating user:', error));
    console.log('User created:', user);
    res.json(user);
});
exports.createUser = createUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find();
        res.json(users);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching users:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});
exports.getUsers = getUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password } = req.body;
        const user = yield User_1.User.findOneBy({ use_id: parseInt(req.params.use_id) });
        console.log('User found:', user);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        user.userName = userName;
        user.email = email;
        user.password = password;
        yield user.save();
        res.json(user);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching user by ID:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { use_id } = req.params;
        const result = yield User_1.User.delete({ use_id: parseInt(use_id) });
        if (result.affected === 0) {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting user:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});
exports.deleteUser = deleteUser;
