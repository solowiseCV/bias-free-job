import { Request, Response } from 'express';
import { CompanyTeamService } from '../services/company'
import { companyTeamSchema } from '../../../validations/companyDetails.validation';

const companyTeamService = new CompanyTeamService();

export class CompanyTeamController {
  async createCompanyTeam(req: Request, res: Response) {
    const { error } = companyTeamSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    } 
    const result = await companyTeamService.createCompanyTeam(req.user.userId, req.body);
    res.status(201).json({ message: 'Company profile and team created successfully', ...result });
  }
}