import express from "express";
import { InterviewController } from "../controllers/interview.controller";
import { authMiddleware } from "../../../../middlewares/authMiddleware";
const interviewRoutes = express.Router();
const interviewController = new InterviewController();
interviewRoutes.post(
  "/schedule",
  authMiddleware,
  interviewController.createInterview
);

interviewRoutes.get("/:id", authMiddleware, interviewController.getInterviews);

interviewRoutes.get("/", interviewController.getAllInterview);

interviewRoutes.get(
  "/jobseeker/upcoming-interview",
  interviewController.getJobseekerUpcomingInterview
);

interviewRoutes.get(
  "/recruiter/upcoming-interview",
  interviewController.getRecruiterUpcomingInterview
);

interviewRoutes.get(
  "/jobseeker",
  authMiddleware,
  interviewController.getJobSeekerInterviews
);

interviewRoutes.delete(
  "/:id",
  authMiddleware,
  interviewController.deleteInterview
);

interviewRoutes.patch(
  "/:id",
  authMiddleware,
  interviewController.updateInterview
);

export default interviewRoutes;
