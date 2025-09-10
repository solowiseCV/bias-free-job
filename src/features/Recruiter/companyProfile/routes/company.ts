import { Router } from "express";
import { CompanyTeamController } from "../controllers/companyProfile";
import { authMiddleware } from "../../../../middlewares/authMiddleware";
import { CompanyFilterController } from "../controllers/filterQuery";
import { CandidateStarringController } from "../controllers/starCandidate";

const CompanyRoutes = Router();
const controller = new CompanyTeamController();
const filter = new CompanyFilterController();
const starCandidate = new CandidateStarringController();

CompanyRoutes.post("/", authMiddleware, controller.createCompanyTeam);
CompanyRoutes.get("/companyDetails", authMiddleware, controller.getCompanyTeam);
CompanyRoutes.get(
  "/company/details",
  authMiddleware,
  controller.getCompanyDetails
);

CompanyRoutes.get("/allCompanies", controller.getAllCompanies);
CompanyRoutes.patch(
  "/companyUpdate",
  authMiddleware,
  controller.updateCompanyTeam
);
CompanyRoutes.delete(
  "/DeleteCompanyProfile",
  authMiddleware,
  controller.deleteCompanyTeam
);

CompanyRoutes.get(
  "/hired/candidates/:id",
  authMiddleware,
  controller.getHiredCanditdates
);
CompanyRoutes.post("/filter", authMiddleware, filter.saveFilter);

CompanyRoutes.get("/filter/:id", authMiddleware, filter.getFilter);

CompanyRoutes.patch("/filter/:id", authMiddleware, filter.updateFilter);

// Star candidate
CompanyRoutes.post(
  "/starCandidate",
  authMiddleware,
  starCandidate.starCandidate
);

// Unstar candidate
CompanyRoutes.delete(
  "/starCandidate",
  authMiddleware,
  starCandidate.unstarCandidate
);

// Get stared candidates
CompanyRoutes.get(
  "/starCandidate/:companyProfileId",
  authMiddleware,
  starCandidate.getStarredCandidates
);

export default CompanyRoutes;
