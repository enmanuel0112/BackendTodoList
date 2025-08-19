import { Router } from "express";
import { registerUser, updateUser, deleteUser } from "../controllers/user.controller";
import { userLogin } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth.middleware";
import { registerUserSchema, loginUserSchema } from "../dtos/registerUser.dto";
const router = Router();

router.post("/register", validate(registerUserSchema), registerUser);
router.post("/login", validate(loginUserSchema),  userLogin);
// router.get("/users", getUsers);
router.put("/users/update/:id",  authMiddleware, updateUser);
router.delete("/users/delete/:id", authMiddleware, deleteUser);


export default router;