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
interviewRoutes.get("/", interviewController.getInterviews);
interviewRoutes.delete("/:id", interviewController.deleteInterview);
interviewRoutes.patch("/:id", interviewController.updateInterview);
export default interviewRoutes;
