import { NextFunction, Request, Response } from "express";
import { DeleteJobSeekerService } from "../services/deleteJobSeeker";
import CustomResponse from "../../../utils/helpers/response.util";

export class UpdateJobSeekerController {
  static async updateSeeker(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const profileId = req.params.id;

      const result = await DeleteJobSeekerService.deleteSeeker(profileId);
      new CustomResponse(200, true, "sucess", res, result);
    } catch (error) {
      next(error);
    }
  }
}
