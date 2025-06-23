import express from "express";
import authRoutes from "./authentication/routes/auth.route";
import CompanyRoutes from "./Recruiter/routes/company";
import jobsRoutes from "./jobs/routes/job.route";
const appRouter = express.Router();

appRouter.use("/auth", authRoutes);
appRouter.use("/company-profile",CompanyRoutes );
appRouter.use("/jobs", jobsRoutes);
export default appRouter;
