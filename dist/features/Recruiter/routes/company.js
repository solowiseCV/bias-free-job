"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_1 = require("../controllers/company");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const CompanyRoutes = (0, express_1.Router)();
const controller = new company_1.CompanyTeamController();
CompanyRoutes.post('/', authMiddleware_1.authMiddleware, controller.createCompanyTeam);
exports.default = CompanyRoutes;
