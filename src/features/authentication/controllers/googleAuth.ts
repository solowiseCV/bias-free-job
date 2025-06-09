import { Request, Response } from "express";
import { token } from "morgan";
import { tokenService } from "../../../utils/jwt";
import { GoogleAuthDTO } from "../dtos/googleAuthDto";
// import { GoogleAuthService } from "../services/googleAuth";
import { User as AuthUser } from "@prisma/client";

interface User {
  email: string;
  username: String;
  fullname: String;
  lastname: String;
  firstname: String;
  password: String | null;
  avatar: String | null;
  authId: String;
}

export class GoogleAuthController {
  static async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const email: string = req.body.email;
      const firstname: string = req.body.firstname;
      const lastname: string = req.body.lastname;
      const authId: string = req.body.authId;
      const picture: string = req.body.picture;

      const existingUser = await GoogleAuthService.getExistingUser(
        email,
        authId
      );
      let user;
      const userData: User = {
        email,
        lastname,
        firstname,
        authId,
        avatar: picture,
        username: "",
        fullname: "",
        password: null,
      };
      if (!existingUser) {
        user = await GoogleAuthService.registerUser(userData);
      } else {
        user = existingUser;
      }
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
