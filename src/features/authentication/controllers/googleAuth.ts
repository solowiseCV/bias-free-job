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
      const { idToken, userType } = req.body;

      if (!idToken || !userType) {
        res.status(400).json({ error: "Incomplete details" });
        return;
      }

      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        res.status(400).json({ error: "Invalid token" });
        return;
      }

      const email = payload["email"] || null;
      const authId = payload["sub"] || null;

      if (!email || !authId) {
        res.status(400).json({ error: "User data missing from token" });
        return;
      }

      const existingUser = await GoogleAuthService.getExistingUser(
        email,
        authId
      );
      const userData: User = {
        authId,
        email,
        avatar: payload["picture"] || "",
        firstname: payload["given_name"] || "",
        lastname: payload["family_name"] || "",
        userType,
      };

      let user;

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
