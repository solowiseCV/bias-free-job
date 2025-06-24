import express from "express";
const appRouter = express.Router();

import authRoutes from "./authentication/routes/auth.route";
import jobSeekerRoute from "./jobSeeker/routes/jobSeeker.route";
import CompanyRoutes from "./Recruiter/routes/company";
import jobsRoutes from "./jobs/routes/job.route";

appRouter.use("/auth", authRoutes);
appRouter.use("/job-seeker", jobSeekerRoute);
appRouter.use("/company-profile", CompanyRoutes);
appRouter.use("/jobs", jobsRoutes);

export default appRouter;
