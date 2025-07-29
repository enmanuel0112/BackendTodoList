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
exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const data_sources_1 = require("../data-sources");
const Task_1 = require("../entity/Task");
const User_1 = require("../entity/User");
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, isCompleted, useId } = req.body;
        const user_id = yield data_sources_1.AppDataSource.getRepository(User_1.User).findOneBy({ id: useId });
        if (!user_id) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const task = new Task_1.Task();
        task.content = content;
        task.isCompleted = isCompleted;
        task.user = user_id;
        yield task.save();
        res.json(task);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error creating task:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createTask = createTask;
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield Task_1.Task.find();
        res.json(tasks);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching tasks:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});
exports.getTasks = getTasks;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, isCompleted, useId } = req.body;
    const user_id = yield data_sources_1.AppDataSource.getRepository(User_1.User).findOneBy({ id: useId });
    try {
        const task = yield Task_1.Task.findOneBy({ task_id: parseInt(req.params.task_id) });
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        if (!user_id) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        task.content = content;
        task.isCompleted = isCompleted;
        task.user = user_id;
        yield task.save();
        res.json(task);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching task by ID:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { task_id } = req.params;
        const result = yield Task_1.Task.delete({ task_id: parseInt(task_id) });
        if (result.affected === 0) {
            res.status(404).json({ error: 'Task not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting task:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});
exports.deleteTask = deleteTask;
