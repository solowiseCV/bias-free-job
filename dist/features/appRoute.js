"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appRouter = express_1.default.Router();
const auth_route_1 = __importDefault(require("./authentication/routes/auth.route"));
const company_1 = __importDefault(require("./Recruiter/companyProfile/routes/company"));
const job_route_1 = __importDefault(require("./Recruiter/jobs/routes/job.route"));
const jobSeeker_route_1 = __importDefault(require("./jobSeeker/routes/jobSeeker.route"));
appRouter.use("/auth", auth_route_1.default);
appRouter.use("/job-seeker", jobSeeker_route_1.default);
appRouter.use("/company-profile", company_1.default);
appRouter.use("/jobs", job_route_1.default);
exports.default = appRouter;
