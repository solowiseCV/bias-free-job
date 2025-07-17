import express from "express";
const appRouter = express.Router();

import authRoutes from "./authentication/routes/auth.route";
import CompanyRoutes from "./Recruiter/companyProfile/routes/company";
import jobsRoutes from "./Recruiter/jobs/routes/job.route";
import jobSeekerRoute from "./jobSeeker/jobSeekerProfile/routes/jobSeeker.route";
import applicationRoutes from "./jobSeeker/application/routes/jobApplication.route";

appRouter.use("/auth", authRoutes);
appRouter.use("/job-seeker", jobSeekerRoute);
appRouter.use("/company-profile", CompanyRoutes);
appRouter.use("/jobs", jobsRoutes);
appRouter.use("/application", applicationRoutes);

export default appRouter;
