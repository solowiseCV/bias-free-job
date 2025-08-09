import express from "express";
import { GoogleAuthController } from "../controllers/googleAuth";
import { AuthController } from "../controllers/registerUser";
import { LoginController } from "../controllers/loginUser";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { PasswordResetController } from "../controllers/resetUserPassword";
import { ForgotPasswordController } from "../controllers/forgetPassword";
import { ChangePasswordController } from "../controllers/changePassword";
import twoFARoute from './twoFactorAuth.route';

const router = express.Router();

router.post("/google", GoogleAuthController.googleAuth);

router.post("/register", AuthController.register);

router.get("/", AuthController.getUsers);

router.post("/login", LoginController.login);

router.post("/forgot-password", ForgotPasswordController.forgotPassword);

router.post(
  "/change-password",
  authMiddleware,
  ChangePasswordController.changePassword
);

router.patch("/reset-password", PasswordResetController.resetPassword);

router.use('/2fa', twoFARoute);

export default router;
