"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = require("../controllers/jobController");
const authMiddleware_1 = require("../../../../middlewares/authMiddleware");
const multer_1 = require("../../../../middlewares/multer");
const fetchJobs_1 = require("../controllers/fetchJobs");
const jobsRoutes = (0, express_1.Router)();
const controller = new jobController_1.JobPostingController();
const jobSeekerController = new fetchJobs_1.JobSeekerController();

jobsRoutes.post("/postJob", authMiddleware_1.authMiddleware, multer_1.singleupload, controller.createJobPosting);
jobsRoutes.get("/alljobs", authMiddleware_1.authMiddleware, controller.getJobPostings);
jobsRoutes.get("/job/:id", authMiddleware_1.authMiddleware, controller.getJobPostingById);
jobsRoutes.get("/seekersjobs", jobSeekerController.getAllJobs);
jobsRoutes.patch("/update/:id", authMiddleware_1.authMiddleware, multer_1.singleupload, controller.updateJobPosting);
jobsRoutes.delete("/delete/:id", authMiddleware_1.authMiddleware, multer_1.singleupload, controller.deleteJobPosting);
jobsRoutes.get("/jobs", controller.getJobs);

exports.default = jobsRoutes;
