import { Request, Response } from "express";
import { tokenService } from "../../../utils/jwt";
import { PasswordResetService } from "../services/resetUserPassword";

export class PasswordResetController {
  static async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, newPassword } = req.body;
    try {
      const payload = tokenService.verifyToken(token) as any;
      await PasswordResetService.updatePassword(payload.userId, newPassword);
      res
        .status(200)
        .json({ success: true, message: "Password reset successful" });
      return;
    } catch (err: any) {
      res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
      return;
    }
  }
}
