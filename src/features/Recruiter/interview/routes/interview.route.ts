import express from 'express'
import {InterviewController}from '../controllers/interview.controller'
const interviewRoutes = express.Router();
const interviewController = new InterviewController();
interviewRoutes.post("/schedule", interviewController.createInterview)
interviewRoutes.post("/interviews", interviewController.getInterviews)
interviewRoutes.post("/id", interviewController.deleteInterview)
interviewRoutes.post("/id", interviewController.updateInterview)
export default interviewRoutes