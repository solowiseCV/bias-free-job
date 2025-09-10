"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyProfile_1 = require("../controllers/companyProfile");
const authMiddleware_1 = require("../../../../middlewares/authMiddleware");
const filterQuery_1 = require("../controllers/filterQuery");
const starCandidate_1 = require("../controllers/starCandidate");
const CompanyRoutes = (0, express_1.Router)();
const controller = new companyProfile_1.CompanyTeamController();
const filter = new filterQuery_1.CompanyFilterController();
const starCandidate = new starCandidate_1.CandidateStarringController();
CompanyRoutes.post("/", authMiddleware_1.authMiddleware, controller.createCompanyTeam);
CompanyRoutes.get("/companyDetails", authMiddleware_1.authMiddleware, controller.getCompanyTeam);
CompanyRoutes.get("/company/details", authMiddleware_1.authMiddleware, controller.getCompanyDetails);
CompanyRoutes.get("/allCompanies", controller.getAllCompanies);
CompanyRoutes.patch("/companyUpdate", authMiddleware_1.authMiddleware, controller.updateCompanyTeam);
CompanyRoutes.delete("/DeleteCompanyProfile", authMiddleware_1.authMiddleware, controller.deleteCompanyTeam);
CompanyRoutes.get("/hired/candidates/:id", authMiddleware_1.authMiddleware, controller.getHiredCanditdates);
CompanyRoutes.post("/filter", authMiddleware_1.authMiddleware, filter.saveFilter);
CompanyRoutes.get("/filter/:id", authMiddleware_1.authMiddleware, filter.getFilter);
CompanyRoutes.patch("/filter/:id", authMiddleware_1.authMiddleware, filter.updateFilter);
// Star candidate
CompanyRoutes.post("/starCandidate", authMiddleware_1.authMiddleware, starCandidate.starCandidate);
// Unstar candidate
CompanyRoutes.delete("/starCandidate", authMiddleware_1.authMiddleware, starCandidate.unstarCandidate);
// Get stared candidates
CompanyRoutes.get("/starCandidate/:companyProfileId", authMiddleware_1.authMiddleware, starCandidate.getStarredCandidates);
exports.default = CompanyRoutes;
