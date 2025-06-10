import { Request, Response } from "express";
import { tokenService } from "../../../utils/jwt";
import { AuthService } from "../services/registerUser";
import { hashPassword } from "../../../utils/hash";

interface User {
  email: string;
  lastname: String;
  firstname: String;
  fullname: String;
  password: String;
}

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const email: string = req.body.email;
      const firstname: string = req.body.firstname;
      const lastname: string = req.body.lastname;
      const password: string = req.body.password;

      const existingUser = await AuthService.getUserByEmail(email);

      if (existingUser) {
        res
          .status(500)
          .json({ success: false, message: "Email already in use!" });
        return;
      }

      const hashedPassword = await hashPassword(password);
      const fullname = `${firstname} ${lastname}`;
      const userData: User = {
        email,
        lastname,
        firstname,
        fullname,
        password: hashedPassword,
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
