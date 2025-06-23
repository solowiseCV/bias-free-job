import { NextFunction, Request, Response } from "express";
import { CreateJobSeekerDto } from "../dtos/createJobSeekerDto";
import { JobSeekerService } from "../services/createJobSeeker";
import CustomResponse from "../../../utils/helpers/response.util";

export class CreateJobSeekerController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user.id;

      if (!userId) {
        res.status(400).json({ error: "userId is required" });
        return;
      }
      const dto: CreateJobSeekerDto = req.body;

      const result = await JobSeekerService.upsertJobSeekerProfile(dto, userId);
      new CustomResponse(200, true, "sucess", res, result);
    } catch (error) {
      next(error);
    }
  }
}
