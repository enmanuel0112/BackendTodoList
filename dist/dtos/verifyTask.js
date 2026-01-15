"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
exports.createTaskSchema = zod_1.z.object({
    content: zod_1.z.string().min(10, { message: "min 10 caracters" }),
    isCompleted: zod_1.z.boolean().default(false),
});
exports.updateTaskSchema = zod_1.z.object({
    content: zod_1.z.string().min(10, { message: "min 10 caracters" }).optional(),
    isCompleted: zod_1.z.boolean().optional(),
});
