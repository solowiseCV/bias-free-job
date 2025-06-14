import { Request, Response } from "express";
import { tokenService } from "../../../utils/jwt";
import { AuthService } from "../services/registerUser";
import { hashPassword } from "../../../utils/hash";

interface User {
  email: string;
  lastname: String;
  firstname: String;
  password: String;
  userType: string;
}

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, firstname, lastname, password, userType } = req.body;

      const existingUser = await AuthService.getUserByEmail(email);

      if (existingUser) {
        res
          .status(500)
          .json({ success: false, message: "Email already in use!" });
        return;
      }

      const hashedPassword = await hashPassword(password);
      const userData: User = {
        email,
        lastname,
        firstname,
        password: hashedPassword,
        userType,
      };

      const user = await AuthService.registerUser(userData);

      const token = tokenService.generateToken(user.id);

      res.status(200).json({
        success: true,
        message: "Registration successful!",
        data: user,
        token,
      });
      return;
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
      return;
    }
  }
}
