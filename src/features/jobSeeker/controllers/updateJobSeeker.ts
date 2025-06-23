import { NextFunction, Request, Response } from "express";
import { ForgotPasswordService } from "../services/deleteJobSeeker";
import CustomResponse from "../../../utils/helpers/response.util";
import { UpdateJobSeekerService } from "../services/updateJobSeeker";
import { CreateJobSeekerDto } from "../dtos/createJobSeekerDto";

export class UpdateJobSeekerController {
  static async updateSeeker(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const profileId = req.params.id;

      const data: CreateJobSeekerDto = req.body;

      const result = await UpdateJobSeekerService.updateSeeker(profileId, data);
      new CustomResponse(200, true, "sucess", res, result);
    } catch (error) {
      next(error);
    }
  }
}
