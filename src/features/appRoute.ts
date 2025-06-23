import express from "express";
import authRoutes from "./authentication/routes/auth.route";
import jobSeekerRoute from "./jobSeeker/routes/jobSeeker.route";
const appRouter = express.Router();

appRouter.use("/auth", authRoutes);
appRouter.use("/job_seeker", jobSeekerRoute);
export default appRouter;
