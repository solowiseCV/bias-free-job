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
exports.JobSeekerService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class JobSeekerService {
    getAllJobs(page, limit, search, industry, location, status, bestMatches) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereClause = {};
            // Apply filters
            if (search) {
                whereClause.jobTitle = { contains: search, mode: 'insensitive' };
            }
            if (industry) {
                whereClause.industry = { contains: industry, mode: 'insensitive' };
            }
            if (location) {
                whereClause.companyLocation = { contains: location, mode: 'insensitive' };
            }
            if (status) {
                whereClause.status = status;
            }
            const take = limit ? parseInt(limit) : 10;
            const skip = page ? (parseInt(page) - 1) * take : 0;
            // const orderBy: Prisma.JobPostingOrderByWithRelationInput[] = bestMatches === 'true'
            //   ? [{ createdAt: 'desc' }, { monthlySalaryMax: 'desc' }] 
            //   : [{ createdAt: 'desc' }]; 
            const [jobs, total] = yield prisma.$transaction([
                prisma.jobPosting.findMany({
                    where: whereClause,
                    take,
                    skip,
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
}
exports.JobSeekerService = JobSeekerService;
