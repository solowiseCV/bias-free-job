import { Request, Response } from "express";
import { tokenService } from "../../../utils/jwt";
import GoogleAuthService from "../services/googleAuth";
import { GetJobSeekerService } from "../../jobSeeker/services/getJobSeeker";
import { CompanyTeamService } from "../../Recruiter/services/companyProfile";
import { googleAuthSchema } from "../../../validations/googleAuth.validation";

const companyTeamService = new CompanyTeamService();

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
      const { error } = googleAuthSchema.validate(req.body);

      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const { email, picture, userType, given_name, family_name, sub } =
        req.body;

      const authId = sub;
      let profile: any = null;

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
        if (existingUserByEmail.userType === "job_seeker") {
          profile = await GetJobSeekerService.getJobSeekerByUserId(
            existingUserByEmail.id
          );
        } else {
          profile = await companyTeamService.getCompanyTeam(
            existingUserByEmail.id
          );
        }
      }

      const { id, lastname, firstname } = user;

      const token = tokenService.generateToken(user.id);
      const data = { id, email, lastname, firstname, userType };

      res.cookie("userType", userType, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: "Successful!",
        data: { user: data, profile },
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
