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
exports.JobPostingController = void 0;
const jobService_1 = require("../services/jobService");
const job_validation_1 = require("../../../validations/job.validation");
const multer_1 = require("../../../middlewares/multer");
const cloudinary_1 = __importDefault(require("../../../configs/cloudinary"));
const jobPostingService = new jobService_1.JobPostingService();
const cloudinary = (0, cloudinary_1.default)();
class JobPostingController {
    createJobPosting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.file && !req.body.assessment) {
                res.status(400).json({ error: 'Assessment is required (URL or file)' });
                return;
            }
            const { error } = job_validation_1.jobPostingSchema.validate(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            let assessmentUrl = req.body.assessment;
            if (req.file) {
                try {
                    const fileData = { originalname: req.file.originalname, buffer: req.file.buffer };
                    const dataUri = (0, multer_1.getDataUri)(fileData);
                    const result = yield cloudinary.uploader.upload(dataUri.content, {
                        folder: 'job_assessments',
                        resource_type: 'auto',
                    });
                    assessmentUrl = result.secure_url;
                }
                catch (uploadErr) {
                    res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
                    return;
                }
            }
            const data = {
                jobTitle: req.body.jobTitle,
                department: req.body.department,
                companyLocation: req.body.companyLocation,
                workLocation: req.body.workLocation,
                industry: req.body.industry,
                companyFunction: req.body.companyFunction,
                employmentType: req.body.employmentType,
                experienceLevel: req.body.experienceLevel,
                education: req.body.education,
                monthlySalaryMin: req.body.monthlySalaryMin ? parseFloat(req.body.monthlySalaryMin) : undefined,
                monthlySalaryMax: req.body.monthlySalaryMax ? parseFloat(req.body.monthlySalaryMax) : undefined,
                jobDescription: req.body.jobDescription,
                requirements: req.body.requirements,
                assessmentUrl,
                status: req.body.status,
            };
            console.log(data);
            try {
                const jobPosting = yield jobPostingService.createJobPosting(req.user.id, data);
                res.status(201).json(jobPosting);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    getJobPostings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, search, industry, location, status, bestMatches } = req.query;
            try {
                const jobPostings = yield jobPostingService.getJobPostings(req.user.id, parseInt(page), parseInt(limit), search, industry, location, status, bestMatches);
                res.status(200).json(jobPostings);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    updateJobPosting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.file && req.body.assessment) {
                res.status(400).json({ error: 'Provide either a file or a URL, not both' });
                return;
            }
            const { error } = job_validation_1.updateJobPostingSchema.validate(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            let assessmentUrl;
            if (req.file) {
                try {
                    const fileData = { originalname: req.file.originalname, buffer: req.file.buffer };
                    const dataUri = (0, multer_1.getDataUri)(fileData);
                    const result = yield cloudinary.uploader.upload(dataUri.content, {
                        folder: 'job_assessments',
                        resource_type: 'auto',
                    });
                    assessmentUrl = result.secure_url;
                }
                catch (uploadErr) {
                    res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
                    return;
                }
            }
            else {
                assessmentUrl = req.body.assessment;
            }
            const data = {
                jobTitle: req.body.jobTitle,
                department: req.body.department,
                companyLocation: req.body.companyLocation,
                workLocation: req.body.workLocation,
                industry: req.body.industry,
                companyFunction: req.body.companyFunction,
                employmentType: req.body.employmentType,
                experienceLevel: req.body.experienceLevel,
                education: req.body.education,
                monthlySalaryMin: req.body.monthlySalaryMin ? parseFloat(req.body.monthlySalaryMin) : undefined,
                monthlySalaryMax: req.body.monthlySalaryMax ? parseFloat(req.body.monthlySalaryMax) : undefined,
                jobDescription: req.body.jobDescription,
                requirements: req.body.requirements,
                assessmentUrl,
                status: req.body.status,
            };
            // Filter out undefined values to ensure only provided fields are updated
            const updateData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));
            try {
                const jobPosting = yield jobPostingService.updateJobPosting(req.params.id, updateData);
                res.status(200).json(jobPosting);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    deleteJobPosting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobPosting = yield jobPostingService.deleteJobPosting(req.user.id, req.params.id);
                res.status(200).json({ message: 'Job posting deleted successfully', jobPosting });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.JobPostingController = JobPostingController;
