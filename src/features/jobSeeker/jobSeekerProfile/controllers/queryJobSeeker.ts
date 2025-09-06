import { Request, Response } from "express";
import { SearchJobSeekerService } from "../services/queryJobSeeker";
import { FilterDTO, Filters } from "../dtos/jobSeekerDto";
import { TalentService } from "../services/searchTalent";
import { TalentFilters } from "../dtos/talentDTO";

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
      const filters: TalentFilters = {
        ...req.query,
        page: Number(req.query.page) || 1,
        pageSize: Number(req.query.limit) || 20,
      };
      const result = await TalentService.searchTalent(filters);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getFilter(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      console.log(userId);
      const result = await SearchJobSeekerService.getFilter(userId);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async saveFilter(req: Request, res: Response) {
    try {
      const filters = req.body;
      const userId = req.user.userId;
      const result = await SearchJobSeekerService.saveFilter(filters, userId);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async updateFilter(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const filters: Filters = {
        ...req.query,
        page: Number(req.query.page) || 1,
        pageSize: Number(req.query.pageSize) || 20,
      };
      const result = await SearchJobSeekerService.updateFilter(id, filters);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
