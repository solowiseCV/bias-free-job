"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyProfile_1 = require("../controllers/companyProfile");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const CompanyRoutes = (0, express_1.Router)();
const controller = new companyProfile_1.CompanyTeamController();
CompanyRoutes.post('/', authMiddleware_1.authMiddleware, controller.createCompanyTeam);
exports.default = CompanyRoutes;
