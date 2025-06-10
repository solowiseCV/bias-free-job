import { Request, Response } from "express";

import { sendResetEmail } from "../../../utils/sendEmail";
import { comparePassword } from "../../../utils/hash";
import { PasswordResetService } from "../services/resetUserPassword";
import { AuthService } from "../services/registerUser";
import { tokenService } from "../../../utils/jwt";

export class ForgotPasswordController {
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const user = await AuthService.getUserByEmail(email);
    if (!user) {
      res.status(404).json({ success: false, message: "User doesn't exist!" });
      return;
    }

    const resetToken = tokenService.generateResetToken(user.id);
    await sendResetEmail(email, resetToken);
    res
      .status(200)
      .json({ success: true, message: "Reset link sent to email" });

    return;
  }
}
