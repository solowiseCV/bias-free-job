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
const job_validation_1 = require("../../../../validations/job.validation");
const multer_1 = require("../../../../middlewares/multer");
const cloudinary_1 = __importDefault(require("../../../../configs/cloudinary"));
const appError_1 = require("../../../../lib/appError");
const response_util_1 = __importDefault(require("../../../../utils/helpers/response.util"));
const client_1 = require("@prisma/client");
const jobPostingService = new jobService_1.JobPostingService();
const cloudinary = (0, cloudinary_1.default)();
const prisma = new client_1.PrismaClient();
class JobPostingController {
    //   async createJobPosting(req: Request, res: Response) {
    //     // Validate required assessment input
    //     if (!req.file && !req.body.assessmentUrlInput && !req.body.assessment) {
    //       res.status(400).json({ error: "Assessment is required (URL or file)" });
    //       return;
    //     }
    //     // Validate request body against schema
    //     const { error } = jobPostingSchema.validate(req.body);
    //     if (error) {
    //       res.status(400).json({ error: error.details[0].message });
    //       return;
    //     }
    //     let assessmentUrl: string | undefined;
    //     // Determine assessment URL from input or file upload
    //     if (req.body.assessmentUrlInput) {
    //       assessmentUrl = req.body.assessmentUrlInput;
    //     } else if (req.body.assessment) {
    //       assessmentUrl = req.body.assessment;
    //     }
    //     // Handle file upload if present
    //     if (req.file) {
    //       try {
    //         if (!req.file.buffer || !req.file.originalname) {
    //           throw new Error("Invalid file data");
    //         }
    //         const fileUri = getDataUri(req.file);
    //         //   folder: "job_assessments", // Changed to match assessment context
    //         //   resource_type: "auto", // Allow auto-detection of file type
    //         //   // Removed image-specific transformations to support various file types
    //         // });
    //         const uploadResult = await new Promise((resolve, reject) => {
    //   const stream = cloudinary.uploader.upload_stream(
    //     {
    //       folder: "job_assessments",
    //       resource_type: "auto",
    //     },
    //     (err, result) => {
    //       if (err) return reject(err);
    //       resolve(result);
    //     }
    //   );
    //   stream.end(req.file?.buffer);
    // });
    // assessmentUrl = (uploadResult as any).secure_url;
    //       } catch (uploadError) {
    //         console.error("Cloudinary upload error:", uploadError);
    //         //  res.status(400).json({ error: "Failed to upload assessment to Cloudinary" });
    //         new CustomResponse(
    //           400,
    //           true,
    //           "Failed to upload assessment to Cloudinary",
    //           res,
    //           uploadError
    //         );
    //         return;
    //       }
    //     }
    //     // Prepare data for service
    //     const data: JobPostingDTO = {
    //       jobTitle: req.body.jobTitle,
    //       department: req.body.department,
    //       companyLocation: req.body.companyLocation,
    //       workLocation: req.body.workLocation,
    //       industry: req.body.industry,
    //       companyFunction: req.body.companyFunction,
    //       employmentType: req.body.employmentType,
    //       experienceLevel: req.body.experienceLevel,
    //       education: req.body.education,
    //       monthlySalaryMin: req.body.monthlySalaryMin
    //         ? parseFloat(req.body.monthlySalaryMin)
    //         : undefined,
    //       monthlySalaryMax: req.body.monthlySalaryMax
    //         ? parseFloat(req.body.monthlySalaryMax)
    //         : undefined,
    //       jobDescription: req.body.jobDescription,
    //       requirements: req.body.requirements,
    //       assessmentUrl,
    //       status: req.body.status,
    //     };
    //     // Create job posting
    //     try {
    //       const jobPosting = await jobPostingService.createJobPosting(
    //         req.user.userId,
    //         data
    //       );
    //       new CustomResponse(
    //         201,
    //         true,
    //         "Job created successfully",
    //         res,
    //         jobPosting
    //       );
    //     } catch (err: any) {
    //       const status = err.statusCode || 500;
    //       // res.status(status).json({ error: err.message });
    //       new CustomResponse(status, true, err.message, res, err);
    //     }
    //   }
    createJobPosting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate required assessment input
            if (!req.file && !req.body.assessmentUrlInput && !req.body.assessment) {
                res.status(400).json({ error: "Assessment is required (URL or file)" });
                return;
            }
            // Log raw request body for debugging
            console.log("Raw request body:", req.body);
            // Validate request body against schema
            const { error } = job_validation_1.jobPostingSchema.validate(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            let assessmentUrl;
            // Determine assessment URL from input or file upload
            if (req.body.assessmentUrlInput) {
                assessmentUrl = req.body.assessmentUrlInput;
            }
            else if (req.body.assessment) {
                assessmentUrl = req.body.assessment;
            }
            // Handle file upload if present
            if (req.file) {
                try {
                    if (!req.file.buffer || !req.file.originalname) {
                        throw new Error("Invalid file data");
                    }
                    const fileUri = (0, multer_1.getDataUri)(req.file);
                    const uploadResult = yield new Promise((resolve, reject) => {
                        var _a;
                        const stream = cloudinary.uploader.upload_stream({ folder: "job_assessments", resource_type: "auto" }, (err, result) => {
                            if (err)
                                return reject(err);
                            resolve(result);
                        });
                        stream.end((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer);
                    });
                    assessmentUrl = uploadResult.secure_url;
                }
                catch (uploadError) {
                    console.error("Cloudinary upload error:", uploadError);
                    new response_util_1.default(400, true, "Failed to upload assessment to Cloudinary", res, uploadError);
                    return;
                }
            }
            // Prepare data for service
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
                monthlySalaryMin: req.body.monthlySalaryMin
                    ? parseFloat(req.body.monthlySalaryMin)
                    : undefined,
                monthlySalaryMax: req.body.monthlySalaryMax
                    ? parseFloat(req.body.monthlySalaryMax)
                    : undefined,
                jobDescription: req.body.jobDescription,
                requirements: req.body.requirements,
                assessmentUrl,
                status: req.body.status,
                deadline: req.body.deadline, // Add deadline to the data object
            };
            console.log("Controller data:", data); // Debug log
            // Create job posting
            try {
                const jobPosting = yield jobPostingService.createJobPosting(req.user.userId, data);
                new response_util_1.default(201, true, "Job created successfully", res, jobPosting);
            }
            catch (err) {
                const status = err.statusCode || 500;
                new response_util_1.default(status, true, err.message, res, err);
            }
        });
    }
    getJobPostings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 20, search, industry, location, status, bestMatches, } = req.query;
            try {
                const jobPostings = yield jobPostingService.getJobPostings(req.user.userId, parseInt(page), parseInt(limit), search, industry, location, status, bestMatches);
                new response_util_1.default(200, true, "Job postings retrieved successfully", res, jobPostings);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    getAllJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobPostings = yield jobPostingService.getJobs();
                new response_util_1.default(200, true, "Job postings retrieved successfully", res, jobPostings);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    getJobPostingById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobPosting = yield jobPostingService.getJobPostingById(req.params.id);
                if (!jobPosting) {
                    throw new appError_1.BadRequestError("Job posting not found");
                }
                new response_util_1.default(200, true, "Job posting retrieved successfully", res, jobPosting);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    // async updateJobPosting(req: Request, res: Response) {
    //   const { error } = updateJobPostingSchema.validate(req.body);
    //   if (error) {
    //     res.status(400).json({ error: error.details[0].message });
    //     return;
    //   }
    //   let assessmentUrl: string | undefined;
    //   if (req.body.assessmentUrlInput) {
    //     assessmentUrl = req.body.assessmentUrlInput;
    //   } else if (req.body.assessment) {
    //     assessmentUrl = req.body.assessment;
    //   }
    //   if (req.file) {
    //     try {
    //       const fileData: FileData = {
    //         originalname: req.file.originalname,
    //         buffer: req.file.buffer,
    //       };
    //       const dataUri = getDataUri(fileData);
    //       const result = await cloudinary.uploader.upload(dataUri.content, {
    //         folder: "job_assessments",
    //         resource_type: "auto",
    //       });
    //       assessmentUrl = result.secure_url;
    //     } catch (uploadErr) {
    //       // res.status(500).json({ error: "Failed to upload file to Cloudinary" });
    //       new CustomResponse(
    //         500,
    //         true,
    //         "Failed to upload file to Cloudinary",
    //         res,
    //         uploadErr
    //       );
    //       return;
    //     }
    //   } else {
    //     assessmentUrl = req.body.assessmen;
    //   }
    //   const data: Partial<UpdateJobPostingDTO> = {
    //     jobTitle: req.body.jobTitle,
    //     department: req.body.department,
    //     companyLocation: req.body.companyLocation,
    //     workLocation: req.body.workLocation,
    //     industry: req.body.industry,
    //     companyFunction: req.body.companyFunction,
    //     employmentType: req.body.employmentType,
    //     experienceLevel: req.body.experienceLevel,
    //     education: req.body.education,
    //     monthlySalaryMin: req.body.monthlySalaryMin
    //       ? parseFloat(req.body.monthlySalaryMin)
    //       : undefined,
    //     monthlySalaryMax: req.body.monthlySalaryMax
    //       ? parseFloat(req.body.monthlySalaryMax)
    //       : undefined,
    //     jobDescription: req.body.jobDescription,
    //     requirements: req.body.requirements,
    //     assessment: assessmentUrl,
    //     status: req.body.status,
    //   };
    //   // Filter out undefined values to ensure only provided fields are updated
    //   const updateData = Object.fromEntries(
    //     Object.entries(data).filter(([_, value]) => value !== undefined)
    //   );
    //   try {
    //     const jobPosting = await jobPostingService.updateJobPosting(
    //       req.params.id,
    //       updateData
    //     );
    //     res.status(200).json(jobPosting);
    //   } catch (err: any) {
    //     res.status(400).json({ error: err.message });
    //   }
    // }
    updateJobPosting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = job_validation_1.updateJobPostingSchema.validate(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            let assessmentUrl;
            try {
                if (req.body.assessmentUrlInput) {
                    assessmentUrl = req.body.assessmentUrlInput;
                }
                else if (req.file) {
                    const fileData = {
                        originalname: req.file.originalname,
                        buffer: req.file.buffer,
                    };
                    const dataUri = (0, multer_1.getDataUri)(fileData);
                    const result = yield cloudinary.uploader.upload(dataUri.content, {
                        folder: "job_assessments",
                        resource_type: "auto",
                    });
                    assessmentUrl = result.secure_url;
                }
                else if (req.body.assessment) {
                    assessmentUrl = req.body.assessment;
                }
            }
            catch (uploadErr) {
                new response_util_1.default(500, true, "Failed to upload file to Cloudinary", res, uploadErr);
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
                monthlySalaryMin: req.body.monthlySalaryMin
                    ? parseFloat(req.body.monthlySalaryMin)
                    : undefined,
                monthlySalaryMax: req.body.monthlySalaryMax
                    ? parseFloat(req.body.monthlySalaryMax)
                    : undefined,
                jobDescription: req.body.jobDescription,
                requirements: req.body.requirements,
                assessment: assessmentUrl,
                status: req.body.status,
                currency: req.body.currency,
            };
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
    saveJobPostingAsDraft(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let assessmentUrl;
                // Handle file upload if present
                if (req.file) {
                    try {
                        if (!req.file.buffer || !req.file.originalname) {
                            throw new Error("Invalid file data");
                        }
                        const fileUri = (0, multer_1.getDataUri)(req.file);
                        const uploadResult = yield new Promise((resolve, reject) => {
                            var _a;
                            const stream = cloudinary.uploader.upload_stream({
                                folder: "job_assessments",
                                resource_type: "auto",
                            }, (err, result) => {
                                if (err)
                                    return reject(err);
                                resolve(result);
                            });
                            stream.end((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer);
                        });
                        assessmentUrl = uploadResult.secure_url;
                    }
                    catch (uploadError) {
                        console.error("Cloudinary upload error:", uploadError);
                        new response_util_1.default(400, false, "Failed to upload assessment to Cloudinary", res, uploadError);
                        return;
                    }
                }
                else if (req.body.assessmentUrlInput) {
                    assessmentUrl = req.body.assessmentUrlInput;
                }
                else if (req.body.assessment) {
                    assessmentUrl = req.body.assessment;
                }
                // Prepare data for service - all fields are optional for drafts
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
                    monthlySalaryMin: req.body.monthlySalaryMin
                        ? parseFloat(req.body.monthlySalaryMin)
                        : undefined,
                    monthlySalaryMax: req.body.monthlySalaryMax
                        ? parseFloat(req.body.monthlySalaryMax)
                        : undefined,
                    jobDescription: req.body.jobDescription,
                    requirements: req.body.requirements,
                    assessmentUrl,
                    country: req.body.country,
                    state: req.body.state,
                    currency: req.body.currency,
                    deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
                };
                const jobPosting = yield jobPostingService.saveJobPostingAsDraft(req.user.userId, data);
                new response_util_1.default(201, true, "Job draft saved successfully", res, jobPosting);
            }
            catch (err) {
                const status = err.statusCode || 500;
                new response_util_1.default(status, false, err.message, res, err);
            }
        });
    }
    updateJobPostingToDraft(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = req.params.id;
                let assessmentUrl;
                // Handle file upload if present
                if (req.file) {
                    try {
                        if (!req.file.buffer || !req.file.originalname) {
                            throw new Error("Invalid file data");
                        }
                        const fileUri = (0, multer_1.getDataUri)(req.file);
                        const uploadResult = yield new Promise((resolve, reject) => {
                            var _a;
                            const stream = cloudinary.uploader.upload_stream({
                                folder: "job_assessments",
                                resource_type: "auto",
                            }, (err, result) => {
                                if (err)
                                    return reject(err);
                                resolve(result);
                            });
                            stream.end((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer);
                        });
                        assessmentUrl = uploadResult.secure_url;
                    }
                    catch (uploadError) {
                        console.error("Cloudinary upload error:", uploadError);
                        new response_util_1.default(400, false, "Failed to upload assessment to Cloudinary", res, uploadError);
                        return;
                    }
                }
                else if (req.body.assessmentUrlInput) {
                    assessmentUrl = req.body.assessmentUrlInput;
                }
                else if (req.body.assessment) {
                    assessmentUrl = req.body.assessment;
                }
                // Prepare data for service
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
                    monthlySalaryMin: req.body.monthlySalaryMin
                        ? parseFloat(req.body.monthlySalaryMin)
                        : undefined,
                    monthlySalaryMax: req.body.monthlySalaryMax
                        ? parseFloat(req.body.monthlySalaryMax)
                        : undefined,
                    jobDescription: req.body.jobDescription,
                    requirements: req.body.requirements,
                    assessmentUrl,
                    country: req.body.country,
                    state: req.body.state,
                    currency: req.body.currency,
                    deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
                };
                const jobPosting = yield jobPostingService.updateJobPostingToDraft(req.user.userId, jobId, data);
                new response_util_1.default(200, true, "Job updated to draft successfully", res, jobPosting);
            }
            catch (err) {
                const status = err.statusCode || 500;
                new response_util_1.default(status, false, err.message, res, err);
            }
        });
    }
    getDraftJobPostings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10 } = req.query;
                const result = yield jobPostingService.getDraftJobPostings(req.user.userId, parseInt(page), parseInt(limit));
                new response_util_1.default(200, true, "Draft job postings retrieved successfully", res, result);
            }
            catch (err) {
                const status = err.statusCode || 500;
                new response_util_1.default(status, false, err.message, res, err);
            }
        });
    }
    deleteJobPosting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobPosting = yield jobPostingService.deleteJobPosting(req.user.userId, req.params.id);
                // res
                // .status(200)
                // .json({ message: "Job posting deleted successfully", jobPosting });
                new response_util_1.default(200, true, "Job posting deleted successfully", res, jobPosting);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    getJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobPosting = yield jobPostingService.getJobs();
                // res
                // .status(200)
                // .json({ message: "Job posting deleted successfully", jobPosting });
                new response_util_1.default(200, true, "Job posting deleted successfully", res, jobPosting);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.JobPostingController = JobPostingController;
