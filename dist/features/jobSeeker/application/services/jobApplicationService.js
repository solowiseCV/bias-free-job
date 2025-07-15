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
exports.JobApplicationService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class JobApplicationService {
    createJobApplication(userId, jobPostingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const applicantProfile = yield prisma.jobSeeker.findFirst({
                where: { userId },
            });
            if (!applicantProfile)
                throw new Error("Applicant not found!");
            return prisma.application.create({
                data: {
                    applicantId: applicantProfile.id,
                    jobPostingId: jobPostingId,
                },
            });
        });
    }
    getApplicationsByApplicant(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, page = 1, limit = 10, }) {
            const applicantProfile = yield prisma.jobSeeker.findFirst({
                where: { userId },
            });
            if (!applicantProfile)
                throw new Error("Applicant not found!");
            const applicantId = applicantProfile.id;
            const take = limit;
            const skip = (page - 1) * take;
            const [applications, total] = yield Promise.all([
                prisma.application.findMany({
                    where: { applicantId },
                    skip,
                    take,
                    orderBy: { appliedAt: "desc" },
                    include: {
                        applicant: true,
                    },
                }),
                prisma.application.count({
                    where: { applicantId },
                }),
            ]);
            return {
                applications,
                total,
                page,
                totalPages: Math.ceil(total / take),
            };
        });
    }
    getApplicationsByJobPosting(_a) {
        return __awaiter(this, arguments, void 0, function* ({ jobPostingId, page = 1, limit = 10, }) {
            const take = limit;
            const skip = (page - 1) * take;
            const [applications, total] = yield Promise.all([
                prisma.application.findMany({
                    where: { jobPostingId },
                    skip,
                    take,
                    orderBy: { appliedAt: "desc" },
                    include: {
                        applicant: true,
                    },
                }),
                prisma.application.count({
                    where: { jobPostingId },
                }),
            ]);
            return {
                applications,
                total,
                page,
                totalPages: Math.ceil(total / take),
            };
        });
    }
    updateApplication(updatData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, data } = updatData;
            const prismaData = Object.assign({}, data);
            if (data.status !== undefined) {
                prismaData.status = { set: data.status };
            }
            return yield prisma.application.update({
                where: { id },
                data: prismaData,
            });
        });
    }
    deleteApplication(applicantId, jobPostingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.application.delete({
                where: {
                    applicantId_jobPostingId: {
                        applicantId,
                        jobPostingId,
                    },
                },
            });
        });
    }
}
exports.JobApplicationService = JobApplicationService;
