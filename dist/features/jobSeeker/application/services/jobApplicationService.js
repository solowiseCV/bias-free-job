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
    getCompanyJobsPosting(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, companyProfileId, page = 1, limit = 10, }) {
            var _b, _c;
            const skip = (page - 1) * limit;
            const pipeline = [
                {
                    $match: {},
                },
                {
                    $lookup: {
                        from: "CompanyProfile",
                        localField: "companyProfileId",
                        foreignField: "_id",
                        as: "companyProfile",
                    },
                },
                { $unwind: "$companyProfile" },
                {
                    $lookup: {
                        from: "HiringTeam",
                        localField: "companyProfileId",
                        foreignField: "companyProfileId",
                        as: "hiringTeam",
                    },
                },
                { $unwind: "$hiringTeam" },
                {
                    $lookup: {
                        from: "TeamMember",
                        localField: "hiringTeam._id",
                        foreignField: "hiringTeamId",
                        as: "teamMembers",
                    },
                },
                {
                    $addFields: {
                        isOwner: { $eq: ["$companyProfile.userId", { $toObjectId: userId }] },
                        isTeamMember: {
                            $in: [{ $toObjectId: userId }, "$teamMembers.userId"],
                        },
                    },
                },
                {
                    $match: {
                        $or: [
                            { "companyProfile.userId": { $eq: { $toObjectId: userId } } },
                            { isTeamMember: true },
                            { companyProfileId: { $eq: { $toObjectId: companyProfileId } } },
                        ],
                    },
                },
                {
                    $project: {
                        companyProfile: 0,
                        hiringTeam: 0,
                        teamMembers: 0,
                        isOwner: 0,
                        isTeamMember: 0,
                    },
                },
                {
                    $sort: { createdAt: -1 }, // Single sort stage for newest to oldest
                },
                {
                    $facet: {
                        jobPostings: [{ $skip: skip }, { $limit: limit }],
                        totalCount: [{ $count: "count" }],
                    },
                },
                {
                    $project: {
                        jobPostings: 1,
                        total: { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
                    },
                },
            ];
            const results = yield prisma.jobPosting.aggregateRaw({ pipeline });
            const jobPostings = Array.isArray(results) && ((_b = results[0]) === null || _b === void 0 ? void 0 : _b.jobPostings)
                ? results[0].jobPostings
                : [];
            const total = Array.isArray(results) && ((_c = results[0]) === null || _c === void 0 ? void 0 : _c.total) ? results[0].total : 0;
            return {
                jobPostings,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
    getJobPostingsWithApplications(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, companyProfileId, page = 1, limit = 20, }) {
            var _b, _c;
            const skip = (page - 1) * limit;
            const pipeline = [
                {
                    $match: {},
                },
                {
                    $lookup: {
                        from: "CompanyProfile",
                        localField: "companyProfileId",
                        foreignField: "_id",
                        as: "companyProfile",
                    },
                },
                { $unwind: "$companyProfile" },
                {
                    $lookup: {
                        from: "HiringTeam",
                        localField: "companyProfileId",
                        foreignField: "companyProfileId",
                        as: "hiringTeam",
                    },
                },
                { $unwind: "$hiringTeam" },
                {
                    $lookup: {
                        from: "TeamMember",
                        localField: "hiringTeam._id",
                        foreignField: "hiringTeamId",
                        as: "teamMembers",
                    },
                },
                {
                    $addFields: {
                        isOwner: { $eq: ["$companyProfile.userId", { $toObjectId: userId }] },
                        isTeamMember: {
                            $in: [{ $toObjectId: userId }, "$teamMembers.userId"],
                        },
                    },
                },
                {
                    $match: {
                        $or: [
                            { "companyProfile.userId": { $eq: { $toObjectId: userId } } },
                            { isTeamMember: true },
                            { companyProfileId: { $eq: { $toObjectId: companyProfileId } } },
                        ],
                    },
                },
                {
                    $project: {
                        companyProfile: 0,
                        hiringTeam: 0,
                        teamMembers: 0,
                        isOwner: 0,
                        isTeamMember: 0,
                    },
                },
                {
                    $lookup: {
                        from: "Application",
                        localField: "_id",
                        foreignField: "jobPostingId",
                        as: "applications",
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $facet: {
                        jobPostings: [{ $skip: skip }, { $limit: limit }],
                        totalCount: [{ $count: "count" }],
                    },
                },
                {
                    $project: {
                        jobPostings: 1,
                        total: { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
                    },
                },
            ];
            const results = yield prisma.jobPosting.aggregateRaw({ pipeline });
            const jobPostings = Array.isArray(results) && ((_b = results[0]) === null || _b === void 0 ? void 0 : _b.jobPostings)
                ? results[0].jobPostings
                : [];
            const total = Array.isArray(results) && ((_c = results[0]) === null || _c === void 0 ? void 0 : _c.total) ? results[0].total : 0;
            return {
                jobPostings,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
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
                        jobPosting: true,
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
    getMaskedApplicationsByJobPosting(_a) {
        return __awaiter(this, arguments, void 0, function* ({ jobPostingId, page = 1, limit = 10, }) {
            var _b, _c;
            const skip = (page - 1) * limit;
            const pipeline = [
                {
                    $match: { jobPostingId: { $oid: jobPostingId } },
                },
                {
                    $sort: { appliedAt: -1 },
                },
                {
                    $facet: {
                        applications: [
                            { $skip: skip },
                            { $limit: limit },
                            {
                                $lookup: {
                                    from: "JobSeeker",
                                    localField: "applicantId",
                                    foreignField: "_id",
                                    as: "applicant",
                                    pipeline: [
                                        {
                                            $project: {
                                                bio: 1,
                                                interestedRoles: 1,
                                                experience: {
                                                    location: 1,
                                                    description: 1,
                                                },
                                                education: {
                                                    degree: 1,
                                                    field: 1,
                                                    grade: 1,
                                                    description: 1,
                                                    startDate: 1,
                                                    endDate: 1,
                                                },
                                                skills: 1,
                                                workMode: 1,
                                                location: 1,
                                                portfolio: 1,
                                            },
                                        },
                                    ],
                                },
                            },
                            { $unwind: "$applicant" },
                        ],
                        totalCount: [{ $count: "count" }],
                    },
                },
                {
                    $project: {
                        applications: 1,
                        total: { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
                    },
                },
            ];
            const results = yield prisma.application.aggregateRaw({ pipeline });
            const applications = Array.isArray(results) && ((_b = results[0]) === null || _b === void 0 ? void 0 : _b.applications)
                ? results[0].applications
                : [];
            const total = Array.isArray(results) && ((_c = results[0]) === null || _c === void 0 ? void 0 : _c.total) ? results[0].total : 0;
            return {
                applications,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
    getApplicationsByJobPosting(_a) {
        return __awaiter(this, arguments, void 0, function* ({ jobPostingId, page = 1, limit = 10, }) {
            var _b, _c;
            const skip = (page - 1) * limit;
            const pipeline = [
                {
                    $match: { jobPostingId: { $oid: jobPostingId } },
                },
                {
                    $sort: { appliedAt: -1 },
                },
                {
                    $facet: {
                        applications: [
                            { $skip: skip },
                            { $limit: limit },
                            {
                                $lookup: {
                                    from: "JobSeeker",
                                    localField: "applicantId",
                                    foreignField: "_id",
                                    as: "applicant",
                                },
                            },
                            { $unwind: "$applicant" },
                            {
                                $lookup: {
                                    from: "Interview",
                                    let: { appId: "$applicantId", jobId: "$jobPostingId" },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ["$applicantId", "$$appId"] },
                                                        { $eq: ["$jobPostingId", "$$jobId"] },
                                                    ],
                                                },
                                            },
                                        },
                                    ],
                                    as: "interviews",
                                },
                            },
                            {
                                $addFields: {
                                    hasInterview: { $gt: [{ $size: "$interviews" }, 0] },
                                },
                            },
                            {
                                $set: {
                                    applicant: {
                                        $cond: {
                                            if: "$hasInterview",
                                            then: "$applicant",
                                            else: {
                                                bio: "$applicant.bio",
                                                interestedRoles: "$applicant.interestedRoles",
                                                experience: {
                                                    $map: {
                                                        input: "$applicant.experience",
                                                        as: "exp",
                                                        in: {
                                                            location: "$$exp.location",
                                                            description: "$$exp.description",
                                                        },
                                                    },
                                                },
                                                education: {
                                                    $map: {
                                                        input: "$applicant.education",
                                                        as: "edu",
                                                        in: {
                                                            degree: "$$edu.degree",
                                                            field: "$$edu.field",
                                                            grade: "$$edu.grade",
                                                            description: "$$edu.description",
                                                            startDate: "$$edu.startDate",
                                                            endDate: "$$edu.endDate",
                                                        },
                                                    },
                                                },
                                                skills: "$applicant.skills",
                                                workMode: "$applicant.workMode",
                                                location: "$applicant.location",
                                                portfolio: "$applicant.portfolio",
                                            },
                                        },
                                    },
                                },
                            },
                            {
                                $project: {
                                    interviews: 0,
                                    hasInterview: 0,
                                },
                            },
                        ],
                        totalCount: [{ $count: "count" }],
                    },
                },
                {
                    $project: {
                        applications: 1,
                        total: { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
                    },
                },
            ];
            const results = yield prisma.application.aggregateRaw({ pipeline });
            const applications = Array.isArray(results) && ((_b = results[0]) === null || _b === void 0 ? void 0 : _b.applications)
                ? results[0].applications
                : [];
            const total = Array.isArray(results) && ((_c = results[0]) === null || _c === void 0 ? void 0 : _c.total) ? results[0].total : 0;
            return {
                applications,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
    updateApplication(updatData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, data } = updatData;
            return yield prisma.application.update({
                where: { id },
                data,
            });
        });
    }
    deleteApplication(applicantId, jobPostingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield prisma.application.findFirst({
                where: {
                    applicantId,
                    jobPostingId,
                },
            });
            if (!data)
                return "Data not found";
            const id = data.id;
            return yield prisma.application.delete({
                where: { id },
            });
        });
    }
}
exports.JobApplicationService = JobApplicationService;
