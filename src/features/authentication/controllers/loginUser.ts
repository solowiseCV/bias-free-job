import { Request, Response } from "express";
import { tokenService } from "../../../utils/jwt";
import { AuthService } from "../services/registerUser";
import { comparePassword } from "../../../utils/hash";
import { GetJobSeekerService } from "../../jobSeeker/services/getJobSeeker";
import { CompanyTeamService } from "../../Recruiter/services/company";

const companyTeamService = new CompanyTeamService();

export class LoginController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      let profile = null;

      const user = await AuthService.getUserByEmail(email);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User Email or Password incorrect!",
        });
        return;
      }

      if (
        !user.password ||
        (user.password && !(await comparePassword(password, user.password)))
      ) {
        res.status(404).json({
          success: false,
          message: "User Email or Password incorrect!",
        });
        return;
      }

      if (user.userType === "job_seeker") {
        profile = await GetJobSeekerService.getJobSeekerByUserId(user.id);
      } else {
        profile = await companyTeamService.getCompanyTeam(user.id);
      }

      const token = tokenService.generateToken(user.id);

      res.status(200).json({
        success: true,
        message: "Login successful!",
        data: { user, profile },
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
