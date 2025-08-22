"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interview_controller_1 = require("../controllers/interview.controller");
const authMiddleware_1 = require("../../../../middlewares/authMiddleware");
const interviewRoutes = express_1.default.Router();
const interviewController = new interview_controller_1.InterviewController();
interviewRoutes.post("/schedule", authMiddleware_1.authMiddleware, interviewController.createInterview);
interviewRoutes.get("/", interviewController.getInterviews);
interviewRoutes.delete("/:id", interviewController.deleteInterview);
interviewRoutes.patch("/:id", interviewController.updateInterview);
exports.default = interviewRoutes;
