import { Router } from "express";
import { updateUser, deleteUser } from "../controllers/user.controller";
import { userLogin, registerUser, profile } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth.middleware";
import { registerUserSchema, loginUserSchema } from "../dtos/registerUser.dto";
const router = Router();

router.post("/register", validate(registerUserSchema), registerUser);
router.post("/login", validate(loginUserSchema),  userLogin);
router.get("/profile", authMiddleware, profile);
router.put("/",  authMiddleware, updateUser);
router.delete("/", authMiddleware, deleteUser);


export default router;