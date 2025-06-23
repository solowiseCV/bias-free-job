import { Request, Response } from "express";
import { tokenService } from "../../../utils/jwt";
import { OAuth2Client } from "google-auth-library";
import GoogleAuthService from "../services/googleAuth";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(CLIENT_ID);

interface User {
  email: string;
  lastname: String;
  firstname: String;
  avatar: String | null;
  authId: String;
  userType: string;
}

export class GoogleAuthController {
  static async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const { email, picture, userType, given_name, family_name, sub } =
        req.body;
      const authId = sub;

      const existingUserByEmail = await GoogleAuthService.getUserByEmail(email);

      const userData: User = {
        authId,
        email,
        avatar: picture,
        firstname: given_name,
        lastname: family_name,
        userType,
      };

      let user;

      if (!existingUserByEmail) {
        user = await GoogleAuthService.registerUser(userData);
      } else {
        user = existingUserByEmail;
      }

      const { id, lastname, firstname } = user;

      const token = tokenService.generateToken(user.id);
      const data = { id, email, lastname, firstname, userType };

      res.status(200).json({
        success: true,
        message: "Successful!",
        data,
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
