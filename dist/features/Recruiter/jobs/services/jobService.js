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
exports.JobPostingService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// @ts-nocheck
class JobPostingService {
    // async createJobPosting(userId: string, data: JobPostingDTO) {
    //   const companyProfile = await prisma.companyProfile.findFirst({
    //     where: { userId },
    //   });
    //   if (!companyProfile)
    //     throw new Error("No company profile found for this user");
    //   const existingJob = await prisma.jobPosting.findFirst({
    //     where: {
    //       companyProfileId: companyProfile?.id,
    //       jobTitle: data.jobTitle,
    //       companyLocation: data.companyLocation,
    //       industry: data.industry,
    //     },
    //   });
    //   if (existingJob) {
    //     throw new Error(
    //       "A job with the same title, location, and industry already exists for this company"
    //     );
    //   }
    //   return prisma.jobPosting.create({
    //     data: {
    //       companyProfileId: companyProfile?.id,
    //       jobTitle: data.jobTitle,
    //       department: data.department,
    //       companyLocation: data.companyLocation,
    //       workLocation: data.workLocation,
    //       industry: data.industry,
    //       country: data.country || "Nigeria",
    //       state: data.state || "Lagos",
    //       companyFunction: data.companyFunction,
    //       currency: data.currency || "NGN",
    //       deadline: data.deadline || null,
    //       employmentType: data.employmentType,
    //       experienceLevel: data.experienceLevel,
    //       education: data.education,
    //       monthlySalaryMin: data.monthlySalaryMin,
    //       monthlySalaryMax: data.monthlySalaryMax,
    //       jobDescription: data.jobDescription,
    //       requirements: data.requirements,
    //       assessment: data.assessmentUrl,
    //       status: data.status || "active",
    //     },
    //   });
    // }
    createJobPosting(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate userId
            if (!userId) {
                throw new Error("Invalid user ID provided");
            }
            console.log("Received data:", data);
            // Check if the user has a company profile
            let companyProfile = yield prisma.companyProfile.findFirst({
                where: { userId },
            });
            // Create a default company profile if none exists
            if (!companyProfile) {
                const user = yield prisma.user.findUnique({
                    where: { id: userId },
                });
                if (!user)
                    throw new Error("User not found");
                companyProfile = yield prisma.companyProfile.create({
                    data: {
                        userId,
                        companyName: `${user.firstname || "User"}'s Company`,
                        description: "A company profile created for job posting.",
                        industry: data.industry || "Unknown",
                        location: data.companyLocation || "Unknown",
                        numberOfEmployees: "1-10",
                    },
                });
            }
            const existingJob = yield prisma.jobPosting.findFirst({
                where: {
                    companyProfileId: companyProfile.id,
                    jobTitle: data.jobTitle,
                    companyLocation: data.companyLocation,
                    industry: data.industry,
                },
            });
            if (existingJob) {
                throw new Error("A job with the same title, location, and industry already exists for this company");
            }
            // Debug deadline conversion
            let deadlineValue = null;
            if (data.deadline) {
                const date = new Date(data.deadline);
                console.log("Converted deadline:", date, "Is valid:", !isNaN(date.getTime()));
                deadlineValue = !isNaN(date.getTime()) ? date : null;
            }
            return prisma.jobPosting.create({
                data: {
                    companyProfileId: companyProfile.id,
                    jobTitle: data.jobTitle,
                    department: data.department,
                    companyLocation: data.companyLocation,
                    workLocation: data.workLocation,
                    industry: data.industry,
                    country: data.country || "Nigeria",
                    state: data.state || "Lagos",
                    companyFunction: data.companyFunction,
                    currency: data.currency || "NGN",
                    deadline: deadlineValue, // Use the validated deadline
                    employmentType: data.employmentType,
                    experienceLevel: data.experienceLevel,
                    education: data.education,
                    monthlySalaryMin: data.monthlySalaryMin,
                    monthlySalaryMax: data.monthlySalaryMax,
                    jobDescription: data.jobDescription,
                    requirements: data.requirements,
                    assessment: data.assessmentUrl,
                    status: data.status || "active",
                },
            });
        });
    }
    getJobPostings(userId, page, limit, search, industry, location, status, bestMatches) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify the user has a valid company profile
            const companyProfile = yield prisma.companyProfile.findFirst({
                where: { userId },
                include: { jobPostings: true },
            });
            if (!companyProfile)
                return {
                    jobs: [],
                    total: 0,
                    page: page || 1,
                    limit: limit ? parseInt(limit) : 10,
                };
            const whereClause = {
                companyProfileId: companyProfile.id,
            };
            // Apply filters
            if (search) {
                whereClause.jobTitle = { contains: search, mode: "insensitive" };
            }
            if (industry) {
                whereClause.industry = { contains: industry, mode: "insensitive" };
            }
            if (location) {
                whereClause.companyLocation = { contains: location, mode: "insensitive" };
            }
            if (status) {
                whereClause.status = status;
            }
            if (bestMatches === "true") {
                whereClause.status = "active";
            }
            const take = limit ? parseInt(limit) : 10;
            const skip = page ? (parseInt(page) - 1) * take : 0;
            const orderBy = bestMatches === "true"
                ? [{ createdAt: "desc" }, { monthlySalaryMax: "desc" }]
                : [{ createdAt: "desc" }];
            const [jobs, total] = yield prisma.$transaction([
                prisma.jobPosting.findMany({
                    where: whereClause,
                    take,
                    skip,
                    orderBy,
                    include: {
                        companyProfile: { select: { companyName: true } },
                        applications: true,
                        interviews: true,
                    },
                }),
                prisma.jobPosting.count({ where: whereClause }),
            ]);
            return {
                jobs: jobs.map((job) => {
                    const bestMatches = job.applications
                        ? job.applications.filter((app) => app.status === "accepted" || app.status === "hired").length
                        : 0;
                    return {
                        id: job.id,
                        jobTitle: job.jobTitle,
                        companyName: job.companyProfile.companyName,
                        companyLocation: job.companyLocation,
                        workLocation: job.workLocation,
                        industry: job.industry,
                        employmentType: job.employmentType,
                        monthlySalaryMin: job.monthlySalaryMin,
                        monthlySalaryMax: job.monthlySalaryMax,
                        status: job.status,
                        postedOn: job.createdAt,
                        totalApplications: job.applications ? job.applications.length : 0,
                        peopleInterviewed: job.interviews ? job.interviews.length : 0,
                        applications: job.applications || [],
                        interviews: job.interviews || [],
                        bestMatches,
                    };
                }),
                total,
                page: page || 1,
                limit: take,
            };
        });
    }
    getJobPostingById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const jobPosting = yield prisma.jobPosting.findUnique({
                where: { id },
                include: {
                    companyProfile: { select: { companyName: true } },
                    applications: true,
                    interviews: true,
                },
            });
            if (!jobPosting)
                throw new Error("Job posting not found");
            return {
                id: jobPosting.id,
                jobTitle: jobPosting.jobTitle,
                companyName: jobPosting.companyProfile.companyName,
                companyLocation: jobPosting.companyLocation,
                workLocation: jobPosting.workLocation,
                industry: jobPosting.industry,
                employmentType: jobPosting.employmentType,
                monthlySalaryMin: jobPosting.monthlySalaryMin,
                monthlySalaryMax: jobPosting.monthlySalaryMax,
                status: jobPosting.status,
                deadline: jobPosting.deadline,
                experienceLevel: jobPosting.experienceLevel,
                education: jobPosting.education,
                department: jobPosting.department,
                companyFunction: jobPosting.companyFunction,
                currency: jobPosting.currency,
                jobDescription: jobPosting.jobDescription,
                requirements: jobPosting.requirements,
                assessmentUrl: jobPosting.assessment,
                totalApplications: ((_a = jobPosting.applications) === null || _a === void 0 ? void 0 : _a.length) || 0,
                peopleInterviewed: ((_b = jobPosting.interviews) === null || _b === void 0 ? void 0 : _b.length) || 0,
                applications: jobPosting.applications || [],
                interviews: jobPosting.interviews || [],
            };
        });
    }
    updateJobPosting(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobPosting = yield prisma.jobPosting.findUnique({ where: { id } });
            if (!jobPosting)
                throw new Error("Job posting not found");
            return prisma.jobPosting.update({
                where: { id },
                data,
            });
        });
    }
    deleteJobPosting(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyProfile = yield prisma.companyProfile.findFirst({
                where: { userId },
            });
            if (!companyProfile)
                throw new Error("No company profile found for this user");
            const jobPosting = yield prisma.jobPosting.findUnique({ where: { id } });
            if (!jobPosting)
                throw new Error("Job posting not found");
            if (jobPosting.companyProfileId !== companyProfile.id)
                throw new Error("Unauthorized to delete this job posting");
            return prisma.jobPosting.delete({
                where: { id },
            });
        });
    }
    getJobs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.jobPosting.findMany();
        });
    }
    fixDeadlines() {
        return __awaiter(this, void 0, void 0, function* () {
            const jobs = yield prisma.jobPosting.findMany();
            console.log(jobs);
            // for (const job of jobs) {
            //   // if (typeof job.deadline === "string") {
            //   const parsedDate = new Date(job.deadline);
            //   await prisma.jobPosting.update({
            //     where: { id: job.id },
            //     data: {
            //       deadline: isNaN(parsedDate.getTime()) ? null : parsedDate,
            //     },
            //   });
            //   // }
            // }
            // return { message: "Deadline fields updated successfully" };
        });
    }
    saveJobPostingAsDraft(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyProfile = yield prisma.companyProfile.findFirst({
                where: { userId },
            });
            if (!companyProfile)
                throw new Error("No company profile found for this user");
            // For drafts, we don't check for existing jobs with same title/location/industry
            // since drafts are meant to be works in progress
            return prisma.jobPosting.create({
                data: {
                    companyProfileId: companyProfile.id,
                    jobTitle: data.jobTitle || "Draft Job Title",
                    department: data.department,
                    companyLocation: data.companyLocation || "Draft Location",
                    workLocation: data.workLocation || "office",
                    industry: data.industry || "Draft Industry",
                    country: data.country || "Nigeria",
                    state: data.state || "Lagos",
                    companyFunction: data.companyFunction,
                    currency: data.currency || "NGN",
                    deadline: data.deadline || null,
                    employmentType: data.employmentType || "full_time",
                    experienceLevel: data.experienceLevel,
                    education: data.education,
                    monthlySalaryMin: data.monthlySalaryMin,
                    monthlySalaryMax: data.monthlySalaryMax,
                    jobDescription: data.jobDescription || "Draft description",
                    requirements: data.requirements,
                    assessment: data.assessmentUrl,
                    status: "draft",
                },
            });
        });
    }
    updateJobPostingToDraft(userId, jobId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyProfile = yield prisma.companyProfile.findFirst({
                where: { userId },
            });
            if (!companyProfile)
                throw new Error("No company profile found for this user");
            // Check if the job posting belongs to this user's company
            const existingJob = yield prisma.jobPosting.findFirst({
                where: {
                    id: jobId,
                    companyProfileId: companyProfile.id,
                },
            });
            if (!existingJob) {
                throw new Error("Job posting not found or you don't have permission to update it");
            }
            return prisma.jobPosting.update({
                where: { id: jobId },
                data: Object.assign(Object.assign({}, data), { status: "draft", updatedAt: new Date() }),
            });
        });
    }
    getDraftJobPostings(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyProfile = yield prisma.companyProfile.findFirst({
                where: { userId },
            });
            if (!companyProfile)
                return { jobs: [], total: 0 };
            const take = limit ? parseInt(limit) : 10;
            const skip = page ? (parseInt(page) - 1) * take : 0;
            const [jobs, total] = yield Promise.all([
                prisma.jobPosting.findMany({
                    where: {
                        companyProfileId: companyProfile.id,
                        status: "draft",
                    },
                    skip,
                    take,
                    orderBy: { updatedAt: "desc" },
                }),
                prisma.jobPosting.count({
                    where: {
                        companyProfileId: companyProfile.id,
                        status: "draft",
                    },
                }),
            ]);
            return { jobs, total };
        });
    }
}
exports.JobPostingService = JobPostingService;
