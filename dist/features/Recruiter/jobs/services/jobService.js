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
class JobPostingService {
    createJobPosting(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyProfile = yield prisma.companyProfile.findFirst({
                where: { userId },
            });
            if (!companyProfile)
                throw new Error("No company profile found for this user");
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
            return prisma.jobPosting.create({
                data: {
                    companyProfileId: companyProfile.id,
                    jobTitle: data.jobTitle,
                    department: data.department,
                    companyLocation: data.companyLocation,
                    workLocation: data.workLocation,
                    industry: data.industry,
                    companyFunction: data.companyFunction,
                    currency: data.currency || "NGN",
                    deadline: data.deadline || new Date().toISOString(),
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
            const companyProfile = yield prisma.companyProfile.findFirst({
                where: { userId },
            });
            if (!companyProfile)
                return { jobs: [], total: 0 };
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
                    // Calculate best matches as applications with status 'accepted' or 'hired'
                    const bestMatches = job.applications
                        ? job.applications.filter((app) => app.status === 'accepted' || app.status === 'hired').length
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
            const jobPosting = yield prisma.jobPosting.findUnique({
                where: { id },
                include: { companyProfile: { select: { companyName: true } } },
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
                jobDescription: jobPosting.jobDescription,
                requirements: jobPosting.requirements,
                assessmentUrl: jobPosting.assessment,
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
}
exports.JobPostingService = JobPostingService;
