import { Router } from "express";
import {
  registerController,
  loginController,
  getCurrentUserController,
  resetPasswordController,
  updateProfileController,
} from "../controllers/auth.controller.mjs";
import {
  registerBodyValidation,
  loginBodyValidation,
  resetPasswordBodyValidation,
} from "../middleware/auth.middleware.mjs";
import { avatarUpload } from "../middleware/upload.middleware.mjs";
import protectUser from "../middleware/protectUser.mjs";

const authRouter = Router();

authRouter.post("/register", registerBodyValidation, registerController);
authRouter.post("/login", loginBodyValidation, loginController);
authRouter.get("/get-user", getCurrentUserController);
authRouter.put("/reset-password", resetPasswordBodyValidation, resetPasswordController);
authRouter.patch("/profile", avatarUpload, protectUser, updateProfileController);

export default authRouter;
