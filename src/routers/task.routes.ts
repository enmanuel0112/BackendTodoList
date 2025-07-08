import { Router } from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/task.controller";
const router = Router();

router.post("/task", createTask);
router.get("/task", getTasks);
router.put("/task/:task_id", updateTask);
router.delete("/task/:task_id", deleteTask)

export default router;