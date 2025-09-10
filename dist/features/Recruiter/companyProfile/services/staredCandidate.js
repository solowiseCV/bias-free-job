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
exports.CandidateStarringService = void 0;
// @ts-nocheck
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CandidateStarringService {
    starCandidate(companyProfileId, jobSeekerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const starredCandidate = yield prisma.starredCandidate.create({
                    data: {
                        companyProfileId,
                        jobSeekerId,
                    },
                    include: {
                        jobSeeker: {
                            include: {
                                user: {
                                    select: {
                                        firstname: true,
                                        lastname: true,
                                        email: true,
                                        avatar: true,
                                    },
                                },
                            },
                        },
                    },
                });
                return {
                    id: starredCandidate.id,
                    jobSeekerId: starredCandidate.jobSeekerId,
                    firstname: starredCandidate.jobSeeker.user.firstname,
                    lastname: starredCandidate.jobSeeker.user.lastname,
                    email: starredCandidate.jobSeeker.user.email,
                    bio: starredCandidate.jobSeeker.bio,
                    skills: starredCandidate.jobSeeker.skills,
                    location: starredCandidate.jobSeeker.location,
                    starredAt: starredCandidate.starredAt,
                };
            }
            catch (error) {
                console.error("Error starring candidate:", error);
                throw new Error("Failed to star candidate");
            }
        });
    }
    unstarCandidate(companyProfileId, jobSeekerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.starredCandidate.delete({
                where: {
                    companyProfileId,
                    jobSeekerId,
                },
            });
        });
    }
    // Get all starred candidates for a company
    getStarredCandidates(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const starredCandidates = yield prisma.starredCandidate.findMany({
                    where: {
                        companyProfileId: companyId,
                    },
                    include: {
                        jobSeeker: {
                            include: {
                                user: {
                                    select: {
                                        firstname: true,
                                        lastname: true,
                                        email: true,
                                        avatar: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        starredAt: "desc",
                    },
                });
                return starredCandidates.map((candidate) => ({
                    id: candidate.id,
                    jobSeekerId: candidate.jobSeekerId,
                    firstname: candidate.jobSeeker.user.firstname,
                    lastname: candidate.jobSeeker.user.lastname,
                    email: candidate.jobSeeker.user.email,
                    bio: candidate.jobSeeker.bio,
                    skills: candidate.jobSeeker.skills,
                    location: candidate.jobSeeker.location,
                    avatar: candidate.jobSeeker.avatar,
                    starredAt: candidate.starredAt,
                }));
            }
            catch (error) {
                console.error("Error fetching starred candidates:", error);
                throw new Error("Failed to fetch starred candidates");
            }
        });
    }
}
exports.CandidateStarringService = CandidateStarringService;
exports.default = CandidateStarringService;
