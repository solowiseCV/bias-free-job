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
exports.InterviewService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class InterviewService {
    authorizeInterview(userId, interview) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interview)
                throw new Error("Interview not found or unauthorized access");
            const companyProfile = yield prisma.companyProfile.findFirst({
                where: { userId },
            });
            if (!companyProfile ||
                interview.jobPosting.companyProfileId !== companyProfile.id) {
                throw new Error("Unauthorized access to this interview");
            }
        });
    }
    createInterview(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorizeInterview(userId);
                const jobPosting = yield prisma.jobPosting.findUnique({
                    where: { id: data.jobPostingId },
                });
                if (!jobPosting)
                    throw new Error("Invalid job posting");
                const interview = yield prisma.interview.create({
                    data: {
                        jobPostingId: data.jobPostingId,
                        applicantId: data.applicantId,
                        dateTime: new Date(data.dateTime),
                        status: data.status || client_1.InterviewStatus.scheduled,
                        notes: data.notes,
                        location: data.location,
                        interviewType: data.interviewType,
                        duration: data.duration,
                        userId,
                    },
                });
                return {
                    id: interview.id,
                    jobPostingId: interview.jobPostingId,
                    applicantId: interview.applicantId,
                    dateTime: interview.dateTime,
                    status: interview.status,
                    notes: interview.notes,
                    location: interview.location,
                    interviewType: interview.interviewType,
                    duration: interview.duration,
                    userId: interview.userId,
                    createdAt: interview.createdAt,
                    updatedAt: interview.updatedAt,
                };
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    if (error.code === "P2002") {
                        throw new Error("An interview for this applicant and job already exists.");
                    }
                    throw new Error(`Database error: ${error.message}`);
                }
                throw new Error(`Failed to create interview: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        });
    }
    getInterviews(userId, jobPostingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companyProfile = yield prisma.companyProfile.findFirst({
                    where: { userId },
                });
                if (!companyProfile)
                    return { interviews: [], total: 0 };
                const whereClause = {
                    jobPosting: { companyProfileId: companyProfile.id },
                };
                if (jobPostingId)
                    whereClause.jobPostingId = jobPostingId;
                const [interviews, total] = yield prisma.$transaction([
                    prisma.interview.findMany({
                        where: whereClause,
                        orderBy: { dateTime: "asc" },
                        include: { jobPosting: true, applicant: true },
                    }),
                    prisma.interview.count({ where: whereClause }),
                ]);
                yield Promise.all(interviews.map((interview) => this.authorizeInterview(userId, interview)));
                return {
                    interviews: interviews.map((interview) => ({
                        id: interview.id,
                        jobPostingId: interview.jobPostingId,
                        applicantId: interview.applicantId,
                        dateTime: interview.dateTime,
                        status: interview.status,
                        notes: interview.notes,
                        location: interview.location,
                        interviewType: interview.interviewType,
                        duration: interview.duration,
                        userId: interview.userId,
                        createdAt: interview.createdAt,
                        updatedAt: interview.updatedAt,
                    })),
                    total,
                };
            }
            catch (error) {
                throw new Error(`Failed to fetch interviews: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        });
    }
    getJobSeekerInterviews(applicantId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [interviews, total] = yield prisma.$transaction([
                    prisma.interview.findMany({
                        where: { applicantId },
                        orderBy: { dateTime: "asc" },
                        include: { jobPosting: true, applicant: true },
                    }),
                    prisma.interview.count({ where: { applicantId } }),
                ]);
                return {
                    interviews: interviews.map((interview) => ({
                        id: interview.id,
                        jobPostingId: interview.jobPostingId,
                        applicantId: interview.applicantId,
                        dateTime: interview.dateTime,
                        status: interview.status,
                        notes: interview.notes,
                        location: interview.location,
                        interviewType: interview.interviewType,
                        duration: interview.duration,
                        userId: interview.userId,
                        createdAt: interview.createdAt,
                        updatedAt: interview.updatedAt,
                    })),
                    total,
                };
            }
            catch (error) {
                throw new Error(`Failed to fetch interviews: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        });
    }
    updateInterview(userId, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const interview = yield prisma.interview.findUnique({
                    where: { id },
                    include: { jobPosting: true },
                });
                yield this.authorizeInterview(userId, interview);
                const updatedInterview = yield prisma.interview.update({
                    where: { id },
                    data: {
                        jobPostingId: data.jobPostingId,
                        applicantId: data.applicantId,
                        dateTime: data.dateTime ? new Date(data.dateTime) : undefined,
                        status: data.status,
                        notes: data.notes,
                        location: data.location,
                        interviewType: data.interviewType,
                        duration: data.duration,
                        userId: data.userId,
                    },
                });
                return {
                    id: updatedInterview.id,
                    jobPostingId: updatedInterview.jobPostingId,
                    applicantId: updatedInterview.applicantId,
                    dateTime: updatedInterview.dateTime,
                    status: updatedInterview.status,
                    notes: updatedInterview.notes,
                    location: updatedInterview.location,
                    interviewType: updatedInterview.interviewType,
                    duration: updatedInterview.duration,
                    userId: updatedInterview.userId,
                    createdAt: updatedInterview.createdAt,
                    updatedAt: updatedInterview.updatedAt,
                };
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    throw new Error(`Database error: ${error.message}`);
                }
                throw new Error(`Failed to update interview: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        });
    }
    deleteInterview(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const interview = yield prisma.interview.findUnique({
                    where: { id },
                    include: { jobPosting: true },
                });
                yield this.authorizeInterview(userId, interview);
                yield prisma.interview.delete({ where: { id } });
                return { message: "Interview deleted successfully" };
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    throw new Error(`Database error: ${error.message}`);
                }
                throw new Error(`Failed to delete interview: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        });
    }
}
exports.InterviewService = InterviewService;
