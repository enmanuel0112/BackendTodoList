import { Router } from "express";
import { createUser, getUsers, updateUser, deleteUser } from "../controllers/user.controller";
const router = Router();

router.post("/users", createUser);
router.get("/users", getUsers);
router.put("/users/:use_id", updateUser);
router.delete("/users/:use_id", deleteUser)


export default router;