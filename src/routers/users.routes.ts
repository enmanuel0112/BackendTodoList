import { Router } from "express";
import { registerUser, getUsers, updateUser, deleteUser } from "../controllers/user.controller";
import { userLogin } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { registerUserSchema, loginUserSchema } from "../dtos/registerUser.dto";
const router = Router();

router.post("/register", validate(registerUserSchema), registerUser);
router.post("/login", validate(loginUserSchema), userLogin);
router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);


export default router;