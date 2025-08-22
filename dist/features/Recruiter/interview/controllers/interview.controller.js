"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewController = void 0;
const interview_service_1 = require("../services/interview.service");
const interview_validation_1 = require("../../../../validations/interview.validation");
const interviewService = new interview_service_1.InterviewService();
class InterviewController {
    createInterview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = interview_validation_1.interviewSchema.validate(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            try {
                const result = yield interviewService.createInterview(req.user.userId, req.body);
                res
                    .status(201)
                    .json(Object.assign({ message: "Interview created successfully" }, result));
            }
            catch (error) {
                console.error("Error in createInterview:", error);
                if (error instanceof Error) {
                    if (error.message.includes("already exists")) {
                        res.status(409).json({ error: error.message });
                        return;
                    }
                    res.status(500).json({
                        error: "An unexpected error occurred. Please try again later.",
                    });
                    return;
                }
                res.status(500).json({ error: "An unexpected server error occurred." });
                return;
            }
        });
    }
    getInterviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobPostingId = req.params.id;
            try {
                const result = yield interviewService.getInterviews(req.user.userId, jobPostingId);
                res.status(200).json(result);
            }
            catch (error) {
                console.error("Error in getInterviews:", error);
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                    return;
                }
                res.status(500).json({ error: "An unexpected server error occurred." });
                return;
            }
        });
    }
    updateInterview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = interview_validation_1.updateInterviewSchema.validate(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            try {
                const result = yield interviewService.updateInterview(req.user.userId, req.params.id, req.body);
                res
                    .status(200)
                    .json(Object.assign({ message: "Interview updated successfully" }, result));
            }
            catch (error) {
                console.error("Error in updateInterview:", error);
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                    return;
                }
                res.status(500).json({ error: "An unexpected server error occurred." });
                return;
            }
        });
    }
    deleteInterview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield interviewService.deleteInterview(req.user.userId, req.params.id);
                res.status(200).json(result);
            }
            catch (error) {
                console.error("Error in deleteInterview:", error);
                if (error instanceof Error) {
                    res.status(404).json({ error: error.message });
                    return;
                }
                res.status(500).json({ error: "An unexpected server error occurred." });
                return;
            }
        });
    }
}
exports.InterviewController = InterviewController;
