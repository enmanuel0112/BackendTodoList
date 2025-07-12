import { Router } from "express";
import { registerUser, userLogin, getUsers, updateUser, deleteUser } from "../controllers/user.controller";
const router = Router();

router.post("/users", registerUser);
router.post("/login", userLogin);
router.get("/users", getUsers);
router.put("/users/:use_id", updateUser);
router.delete("/users/:use_id", deleteUser)


export default router;