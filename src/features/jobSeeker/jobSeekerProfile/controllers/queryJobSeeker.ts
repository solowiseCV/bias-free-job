import { Request, Response } from "express";
import { SearchJobSeekerService } from "../services/queryJobSeeker";

export class QueryJobSeekerController {
  static async querySeeker(req: Request, res: Response) {
    try {
      const result = await SearchJobSeekerService.searchJobSeekers(req.query);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async searchTalent(req: Request, res: Response) {
    try {
      const result = await SearchJobSeekerService.searchTalent(req.query);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
