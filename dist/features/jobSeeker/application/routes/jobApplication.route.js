"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applicationController_1 = require("../controllers/applicationController");
const authMiddleware_1 = require("../../../../middlewares/authMiddleware");
const applicationRoutes = (0, express_1.Router)();
const controller = new applicationController_1.ApplicationController();
applicationRoutes.post("/apply/:jobPostingId", authMiddleware_1.authMiddleware, controller.createAplication);
applicationRoutes.get("/job-applications/:id", 
// authMiddleware,
controller.getJobApplications);
applicationRoutes.get("/user-applications/", authMiddleware_1.authMiddleware, controller.getUserApplications);
applicationRoutes.patch("/update/:id", authMiddleware_1.authMiddleware, controller.updateApplication);
applicationRoutes.delete("/delete/:id", authMiddleware_1.authMiddleware, controller.deleteApplication);
exports.default = applicationRoutes;
