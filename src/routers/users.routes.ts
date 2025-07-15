import { Router } from "express";
import { registerUser, userLogin, getUsers, updateUser, deleteUser } from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import { registerUserSchema, loginUserSchema } from "../dtos/registerUser.dto";
const router = Router();

router.post("/register", validate(registerUserSchema), registerUser);
router.post("/login", validate(loginUserSchema), userLogin);
router.get("/users", getUsers);
router.put("/users/:use_id", updateUser);
router.delete("/users/:use_id", deleteUser)


export default router;