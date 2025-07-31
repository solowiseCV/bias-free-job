import { Router } from 'express';
import { CompanyTeamController } from '../controllers/companyProfile';
import { authMiddleware } from '../../../../middlewares/authMiddleware';

const CompanyRoutes = Router();
const controller = new CompanyTeamController();

CompanyRoutes.post('/',authMiddleware, controller.createCompanyTeam);
CompanyRoutes.get('/companyDetails', authMiddleware,controller.getCompanyTeam );
CompanyRoutes.patch('/companyUpdate', authMiddleware,controller.updateCompanyTeam );
CompanyRoutes.delete('/DeleteCompanyProfile', authMiddleware,controller.updateCompanyTeam );

export default CompanyRoutes;