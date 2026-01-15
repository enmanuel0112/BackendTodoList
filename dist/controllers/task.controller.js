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
exports.deleteTask = exports.editTask = exports.getTasks = exports.createTask = void 0;
const data_sources_1 = require("../config/data-sources");
const Task_1 = require("../entity/Task");
const User_1 = require("../entity/User");
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.user.id);
        const { content, isCompleted = false } = req.body;
        const user = yield data_sources_1.AppDataSource.getRepository(User_1.User).findOneBy({
            id: userId,
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const sanitizeUser = (user_id) => {
            const { password } = user_id, userWithoutPassword = __rest(user_id, ["password"]);
            return userWithoutPassword;
        };
        const task = new Task_1.Task();
        if (content) {
            task.content = content;
        }
        if (isCompleted !== undefined) {
            task.isCompleted = isCompleted;
        }
        if (user) {
            task.user = user;
        }
        yield task.save();
        res.json({
            message: "Task created successfully",
            task: Object.assign(Object.assign({}, task), { user: sanitizeUser(user) }),
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.createTask = createTask;
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const pages = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (pages - 1) * limit;
        const tasks = yield data_sources_1.AppDataSource.getRepository(Task_1.Task)
            .createQueryBuilder("task")
            .where("task.userId = :userId", { userId })
            .orderBy("task.createdAt", "ASC")
            .leftJoinAndSelect("task.user", "user")
            .skip(skip)
            .take(limit);
        const [data, total] = yield tasks.getManyAndCount();
        const filterData = data.map((task) => {
            const _a = task.user, { password, createdAt, updatedAt } = _a, userWithoutPassword = __rest(_a, ["password", "createdAt", "updatedAt"]);
            return Object.assign(Object.assign({}, task), { user: userWithoutPassword });
        });
        res.status(200).json({
            data: filterData,
            total,
            pages,
            totalPages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.getTasks = getTasks;
const editTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.user.id);
    const { content, isCompleted } = req.body;
    try {
        const task = yield data_sources_1.AppDataSource.getRepository(Task_1.Task).findOneBy({
            taskId: parseInt(req.params.taskId),
            user: { id: userId },
        });
        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        if (!userId) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        if (content) {
            task.content = content;
        }
        if (isCompleted !== undefined) {
            task.isCompleted = isCompleted;
        }
        yield task.save();
        res.json({
            task,
            user: userId,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching task by ID:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.editTask = editTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const result = yield data_sources_1.AppDataSource.getRepository(Task_1.Task).delete({
            taskId: parseInt(taskId),
        });
        if (result.affected === 0) {
            res.status(404).json({ error: "Task not found" });
        }
        res.json({
            message: "Task Deleted",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error deleting task:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.deleteTask = deleteTask;
