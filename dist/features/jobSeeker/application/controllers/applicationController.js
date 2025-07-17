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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const jobApplicationService_1 = require("../services/jobApplicationService");
const appError_1 = require("../../../../lib/appError");
const response_util_1 = __importDefault(require("../../../../utils/helpers/response.util"));
const jobApplicationService = new jobApplicationService_1.JobApplicationService();
class ApplicationController {
    // Create application
    createAplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create job application
                const application = yield jobApplicationService.createJobApplication(req.user.userId, req.params.jobPostingId);
                new response_util_1.default(201, true, "Application successful!", res, application);
            }
            catch (err) {
                console.log("Failed to craete application: ", err);
                const status = err.statusCode || 500;
                new response_util_1.default(status, true, err.message, res, err);
            }
        });
    }
    // Get users applications
    getUserApplications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = req.query;
            const data = {
                userId: req.user.userId,
                page: typeof page === "string" ? parseInt(page, 10) : Number(page),
                limit: typeof limit === "string" ? parseInt(limit, 10) : Number(limit),
            };
            try {
                const jobPostings = yield jobApplicationService.getApplicationsByApplicant(data);
                new response_util_1.default(200, true, "Job postings retrieved successfully", res, jobPostings);
            }
            catch (err) {
                console.log("Failed to get application: ", err);
                res.status(400).json({ error: err.message });
            }
        });
    }
    // Get job applications
    getJobApplications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10 } = req.query;
                const data = {
                    jobPostingId: req.params.id,
                    page: typeof page === "string" ? parseInt(page, 10) : Number(page),
                    limit: typeof limit === "string" ? parseInt(limit, 10) : Number(limit),
                };
                const jobPosting = yield jobApplicationService.getApplicationsByJobPosting(data);
                if (!jobPosting) {
                    throw new appError_1.BadRequestError("Job posting not found");
                }
                new response_util_1.default(200, true, "Job posting retrieved successfully", res, jobPosting);
            }
            catch (err) {
                console.log("Failed to get application: ", err);
                res.status(400).json({ error: err.message });
            }
        });
    }
    // Update job application
    updateApplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedata = {
                    id: req.params.id,
                    data: req.body,
                };
                const application = yield jobApplicationService.updateApplication(updatedata);
                new response_util_1.default(200, true, "Job aplication updated successfully", res, application);
            }
            catch (err) {
                console.log("Failed to update application: ", err);
                res.status(400).json({ error: err.message });
            }
        });
    }
    // Delete application
    deleteApplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield jobApplicationService.deleteApplication(req.user.userId, req.params.id);
                new response_util_1.default(200, true, "Application deleted successfully", res);
            }
            catch (err) {
                console.log("Failed to delete application: ", err);
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.ApplicationController = ApplicationController;
