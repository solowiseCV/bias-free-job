import { Request, Response } from "express";
import CandidateStarringService from "../services/staredCandidate";
import CustomResponse from "../../../../utils/helpers/response.util";

const candidateStarringService = new CandidateStarringService();

export class CandidateStarringController {
  async starCandidate(req: Request, res: Response): Promise<void> {
    try {
      const { companyProfileId, jobSeekerId } = req.body;
      const starredCandidate = await candidateStarringService.starCandidate(
        companyProfileId,
        jobSeekerId
      );
      new CustomResponse(
        201,
        true,
        "Candidate starred successfully",
        res,
        starredCandidate
      );
    } catch (err: any) {
      const status = err.statusCode || 500;
      new CustomResponse(status, false, err.message, res);
    }
  }

  async unstarCandidate(req: Request, res: Response): Promise<void> {
    try {
      const { companyProfileId, jobSeekerId } = req.body;
      const starredCandidate = await candidateStarringService.unstarCandidate(
        companyProfileId,
        jobSeekerId
      );
      new CustomResponse(
        201,
        true,
        "Candidate unstarred successfully",
        res,
        starredCandidate
      );
    } catch (err: any) {
      const status = err.statusCode || 500;
      new CustomResponse(status, false, err.message, res);
    }
  }

  // Get all starred candidates
  async getStarredCandidates(req: Request, res: Response): Promise<void> {
    try {
      const companyProfileId = req.params.companyProfileId;
      const starredCandidates =
        await candidateStarringService.getStarredCandidates(companyProfileId);

      new CustomResponse(
        200,
        true,
        "Starred candidates fetched successfully",
        res,
        starredCandidates
      );
    } catch (err: any) {
      const status = err.statusCode || 500;
      new CustomResponse(status, false, err.message, res);
    }
  }
}
