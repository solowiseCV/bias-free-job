import { NextFunction, Request, Response } from "express";
import CustomResponse from "../../../utils/helpers/response.util";
import { GetJobSeekerService } from "../services/getJobSeeker";
export class GetJobSeekerController {
  static async getSeekerById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await GetJobSeekerService.getJobSeekerById(id);
      new CustomResponse(200, true, "sucess", res, result);
      return;
    } catch (error) {
      next(error);
    }
  }

  static async getSeekerByUSerId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user.userId;
      const result = await GetJobSeekerService.getJobSeekerByUserId(userId);
      new CustomResponse(200, true, "sucess", res, result);
      return;
    } catch (error) {
      next(error);
    }
  }
}
