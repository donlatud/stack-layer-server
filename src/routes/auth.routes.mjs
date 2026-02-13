import { Router } from "express";
import {
  registerController,
  loginController,
  getCurrentUserController,
  resetPasswordController,
} from "../controllers/auth.controller.mjs";
import {
  registerBodyValidation,
  loginBodyValidation,
  resetPasswordBodyValidation,
} from "../middleware/auth.middleware.mjs";

const authRouter = Router();

authRouter.post("/register", registerBodyValidation, registerController);
authRouter.post("/login", loginBodyValidation, loginController);
authRouter.get("/get-user", getCurrentUserController);
authRouter.put("/reset-password", resetPasswordBodyValidation, resetPasswordController);

export default authRouter;
