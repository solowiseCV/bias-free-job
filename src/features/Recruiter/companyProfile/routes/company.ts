import { Router } from 'express';
import { CompanyTeamController } from '../controllers/companyProfile';
import { authMiddleware } from '../../../../middlewares/authMiddleware';

const CompanyRoutes = Router();
const controller = new CompanyTeamController();

CompanyRoutes.post('/',authMiddleware, controller.createCompanyTeam);
CompanyRoutes.get('/companyDetails', authMiddleware,controller.getCompanyTeam );
CompanyRoutes.get('/allCompanies', authMiddleware,controller.getAllCompanies );
CompanyRoutes.patch('/companyUpdate', authMiddleware,controller.updateCompanyTeam );
CompanyRoutes.delete('/DeleteCompanyProfile', authMiddleware,controller.deleteCompanyTeam );

export default CompanyRoutes;