import { Request, Response } from 'express';
import { CompanyTeamService } from '../services/companyProfile';
import { companyTeamSchema, updateCompanyTeamSchema } from '../../../../validations/companyDetails.validation';

const companyTeamService = new CompanyTeamService();

export class CompanyTeamController {
  async createCompanyTeam(req: Request, res: Response) {
    const { error } = companyTeamSchema.validate(req.body);
    if (error) {
       res.status(400).json({ error: error.details[0].message });
       return
    }
    try {
      const result = await companyTeamService.createCompanyTeam(req.user.userId, req.body);
       res.status(201).json({ message: 'Company profile and team created successfully', ...result });
       return
    } catch (error) {
      console.log(error)
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
           res.status(409).json({ error: error.message });
           return
        }
         res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
         return
      }
       res.status(500).json({ error: 'An unexpected server error occurred.' });
       return
    }
  }


  async getCompanyTeam(req: Request, res: Response) {
    try {
      const result = await companyTeamService.getCompanyTeam(req.user.userId);
       res.status(200).json(result);
       return;
    } catch (error) {
      console.error('Error in getCompanyTeam:', error);
      if (error instanceof Error) {
         res.status(404).json({ error: error.message });
         return;
      }
       res.status(500).json({ error: 'An unexpected server error occurred.' });
       return;
    }
  }

  async updateCompanyTeam(req: Request, res: Response) {
   const { error } = updateCompanyTeamSchema.validate(req.body);
    if (error) {
       res.status(400).json({ error: error.details[0].message });
       return;
    }

    try {
      const result = await companyTeamService.updateCompanyTeam(req.user.userId, req.body);
       res.status(200).json({ message: 'Company profile and team updated successfully', ...result });
       return
    } catch (error) {
      console.error('Error in updateCompanyTeam:', error);
      if (error instanceof Error) {
         res.status(500).json({ error: error.message });
         return;
      }
       res.status(500).json({ error: 'An unexpected server error occurred.' });
       return
    }
  }

  async deleteCompanyTeam(req: Request, res: Response) {
    try {
      const result = await companyTeamService.deleteCompanyTeam(req.user.userId);
       res.status(200).json(result);
       return
    } catch (error) {
      console.error('Error in deleteCompanyTeam:', error);
      if (error instanceof Error) {
         res.status(404).json({ error: error.message });
         return
      }
       res.status(500).json({ error: 'An unexpected server error occurred.' });
       return
    }
  }

}