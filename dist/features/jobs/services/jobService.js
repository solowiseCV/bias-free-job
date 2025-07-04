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
                    include: { companyProfile: { select: { companyName: true } } },
                }),
                prisma.jobPosting.count({ where: whereClause }),
            ]);
            return {
                jobs: jobs.map((job) => ({
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
                })),
                total,
                page: page || 1,
                limit: take,
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
