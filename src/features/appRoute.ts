import express from "express";
import authRoutes from "./authentication/routes/auth.route";
import CompanyRoutes from "./Recruiter/routes/company";
const appRouter = express.Router();

appRouter.use("/auth", authRoutes);
appRouter.use("/company-profile",CompanyRoutes );
export default appRouter;
