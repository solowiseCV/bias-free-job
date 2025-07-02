import { Router } from 'express';
import { CompanyTeamController } from '../controllers/companyProfile';
import { authMiddleware } from '../../../../middlewares/authMiddleware';

const CompanyRoutes = Router();
const controller = new CompanyTeamController();

CompanyRoutes.post('/',authMiddleware, controller.createCompanyTeam);

export default CompanyRoutes;