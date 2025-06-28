import express from "express";
const appRouter = express.Router();

import authRoutes from "./authentication/routes/auth.route";
import CompanyRoutes from "./Recruiter/companyProfile/routes/company";
import jobsRoutes from "./Recruiter/jobs/routes/job.route";
import jobSeekerRoute from "./jobSeeker/routes/jobSeeker.route";


appRouter.use("/auth", authRoutes);
appRouter.use("/job-seeker", jobSeekerRoute);
appRouter.use("/company-profile", CompanyRoutes);
appRouter.use("/jobs", jobsRoutes);

export default appRouter;
