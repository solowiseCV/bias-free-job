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
exports.CompanyTeamService = void 0;
// @ts-nocheck
const client_1 = require("@prisma/client");
const mail_1 = require("../../../../utils/mail");
const nodemailer_1 = require("../../../../utils/nodemailer");
const appError_1 = require("../../../../lib/appError");
const prisma = new client_1.PrismaClient();
class CompanyTeamService {
    createCompanyTeam(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const existingProfile = yield tx.companyProfile.findFirst({
                        where: { userId },
                    });
                    if (existingProfile) {
                        throw new Error("A company profile already exists for this user.");
                    }
                    const existingCompany = yield tx.companyProfile.findUnique({
                        where: { companyName: data.companyName },
                    });
                    if (existingCompany) {
                        throw new Error("A company with this name already exists. Please choose another name.");
                    }
                    const companyProfile = yield tx.companyProfile.create({
                        data: {
                            userId,
                            companyName: data.companyName,
                            description: data.description,
                            industry: data.industry,
                            website: data.website,
                            location: data.location,
                            numberOfEmployees: data.numberOfEmployees,
                        },
                    });
                    const hiringTeam = yield tx.hiringTeam.create({
                        data: {
                            companyProfileId: companyProfile.id,
                        },
                    });
                    // Add the creator as the first team member with role superAdmin
                    const creatorUser = yield tx.user.findUnique({
                        where: { id: userId },
                    });
                    if (!creatorUser) {
                        throw new Error("Creator user not found.");
                    }
                    yield tx.teamMember.create({
                        data: {
                            hiringTeamId: hiringTeam.id,
                            email: creatorUser.email,
                            role: "superadmin",
                            userId: creatorUser.id,
                        },
                    });
                    // Create additional team members from data.teamMembers if provided
                    const teamMembersToCreate = data.teamMembers || [];
                    for (const member of teamMembersToCreate) {
                        const existingUser = yield tx.user.findUnique({
                            where: { email: member.email },
                        });
                        yield tx.teamMember.create({
                            data: {
                                hiringTeamId: hiringTeam.id,
                                email: member.email,
                                role: member.role,
                                userId: (existingUser === null || existingUser === void 0 ? void 0 : existingUser.id) || null,
                            },
                        });
                    }
                    return {
                        companyProfileId: companyProfile.id,
                        hiringTeamId: hiringTeam.id,
                        teamMembers: [
                            { email: creatorUser.email, role: "superAdmin" },
                            ...(data.teamMembers || []),
                        ],
                        companyName: data.companyName,
                    };
                }));
                // Send emails after transaction success
                yield Promise.all(result.teamMembers.map((member) => __awaiter(this, void 0, void 0, function* () {
                    const isExistingUser = yield prisma.user.findUnique({
                        where: { email: member.email },
                    });
                    const mailOptions = yield (0, mail_1.hiringTeamMailOptionSendEmail)(member.email, result.companyName, !!isExistingUser);
                    yield nodemailer_1.transporter.sendMail(mailOptions);
                })));
                return result;
            }
            catch (error) {
                console.log(error);
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    if (error.code === "P2002") {
                        throw new Error("A company profile with this user ID already exists. Please use a different user or update the existing profile.");
                    }
                    throw new Error(`Database error: ${error.message}`);
                }
                throw error;
            }
        });
    }
    getCompanyTeam(userId, companyName) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const teamMembers = yield prisma.teamMember.findMany({
                    where: { userId },
                    include: {
                        hiringTeam: {
                            include: {
                                companyProfile: true,
                                teamMembers: {
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                firstname: true,
                                                lastname: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                if (!teamMembers.length) {
                    throw new Error("No company profile found for this user.");
                }
                const companyNames = teamMembers
                    .map((tm) => { var _a, _b; return (_b = (_a = tm.hiringTeam) === null || _a === void 0 ? void 0 : _a.companyProfile) === null || _b === void 0 ? void 0 : _b.companyName; })
                    .filter((name) => name !== undefined && name !== null);
                if (companyNames.length > 1) {
                    if (!companyName) {
                        return {
                            message: "You are part of multiple companies. Please select one:",
                            companies: companyNames.map((name) => ({ companyName: name })),
                        };
                    }
                    const filteredTeamMember = teamMembers.find((tm) => { var _a, _b; return ((_b = (_a = tm.hiringTeam) === null || _a === void 0 ? void 0 : _a.companyProfile) === null || _b === void 0 ? void 0 : _b.companyName) === companyName; });
                    if (!filteredTeamMember ||
                        !((_a = filteredTeamMember.hiringTeam) === null || _a === void 0 ? void 0 : _a.companyProfile)) {
                        throw new Error("Selected company not found.");
                    }
                    const companyProfile = filteredTeamMember.hiringTeam.companyProfile;
                    return {
                        companyProfileId: companyProfile.id,
                        companyName: companyProfile.companyName || "",
                        description: companyProfile.description || "",
                        industry: companyProfile.industry || "",
                        website: companyProfile.website || "",
                        location: companyProfile.location || "",
                        numberOfEmployees: companyProfile.numberOfEmployees || "",
                        hiringTeam: Object.assign(Object.assign({}, filteredTeamMember.hiringTeam), { companyProfile: undefined }),
                    };
                }
                const companyProfile = (_b = teamMembers[0].hiringTeam) === null || _b === void 0 ? void 0 : _b.companyProfile;
                if (!companyProfile) {
                    throw new Error("No company profile found for this user.");
                }
                return {
                    companyProfileId: companyProfile.id,
                    companyName: companyProfile.companyName || "",
                    description: companyProfile.description || "",
                    industry: companyProfile.industry || "",
                    website: companyProfile.website || "",
                    location: companyProfile.location || "",
                    numberOfEmployees: companyProfile.numberOfEmployees || "",
                    hiringTeam: Object.assign(Object.assign({}, teamMembers[0].hiringTeam), { companyProfile: undefined }),
                };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to fetch company team: ${error.message}`);
                }
                throw new Error("Unexpected error while fetching company team.");
            }
        });
    }
    getCompanyProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.companyProfile.findFirst({
                where: { userId },
                include: {
                    hiringTeam: {
                        include: {
                            teamMembers: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            email: true,
                                            firstname: true,
                                            lastname: true,
                                            avatar: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        });
    }
    getHiredJobSeekers(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalHired = yield prisma.application.count({
                    where: {
                        jobPosting: {
                            companyProfileId: companyId,
                        },
                        status: "hired",
                    },
                });
                const include = {
                    user: {
                        select: {
                            firstname: true,
                            lastname: true,
                            email: true,
                            avatar: true,
                        },
                    },
                    applications: {
                        where: {
                            jobPosting: {
                                companyProfileId: companyId,
                            },
                            status: "hired",
                        },
                        include: {
                            jobPosting: {
                                include: {
                                    companyProfile: true,
                                },
                            },
                        },
                        orderBy: {
                            updatedAt: "desc",
                        },
                        take: 1,
                    },
                };
                const where = {
                    applications: {
                        some: {
                            jobPosting: {
                                companyProfileId: companyId,
                            },
                            status: "hired",
                        },
                    },
                };
                const hiredJobSeekersData = yield prisma.jobSeeker.findMany({
                    where,
                    include,
                    orderBy: {
                        applications: {
                            some: {
                                updatedAt: "desc",
                            },
                        },
                    },
                    take: 10,
                });
                const hiredJobSeekers = hiredJobSeekersData.map((jobSeeker) => {
                    const hiredApplication = jobSeeker.applications[0];
                    return {
                        id: jobSeeker.id,
                        userId: jobSeeker.userId,
                        firstname: jobSeeker.user.firstname,
                        lastname: jobSeeker.user.lastname,
                        email: jobSeeker.user.email,
                        bio: jobSeeker.bio,
                        skills: jobSeeker.skills,
                        location: jobSeeker.location,
                        hiredAt: hiredApplication.appliedAt,
                        companyName: hiredApplication.jobPosting.companyProfile.companyName,
                    };
                });
                return {
                    totalHired,
                    hiredJobSeekers,
                };
            }
            catch (error) {
                console.error("Error fetching hired job seekers:", error);
                throw new Error("Failed to fetch hired job seekers");
            }
        });
    }
    getAllCompanies() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companies = yield prisma.companyProfile.findMany({
                    include: {
                        hiringTeam: {
                            include: {
                                teamMembers: {
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                email: true,
                                                firstname: true,
                                                lastname: true,
                                                avatar: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                if (!companies.length) {
                    return {
                        message: "No companies found on the platform.",
                        companies: [],
                    };
                }
                return {
                    totalCompanies: companies.length,
                    companies: companies.map((company) => ({
                        companyProfileId: company.id,
                        companyName: company.companyName || "",
                        description: company.description || "",
                        industry: company.industry || "",
                        website: company.website || "",
                        location: company.location || "",
                        numberOfEmployees: company.numberOfEmployees || "",
                        hiringTeam: company.hiringTeam
                            ? Object.assign(Object.assign({}, company.hiringTeam), { companyProfile: undefined }) : null,
                    })),
                };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to fetch companies: ${error.message}`);
                }
                throw new Error("Unexpected error while fetching companies.");
            }
        });
    }
    updateCompanyTeam(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const companyProfile = yield tx.companyProfile.findFirst({
                        where: { userId },
                    });
                    if (!companyProfile) {
                        throw new appError_1.NotFoundError("No company profile found for this user.");
                    }
                    const existingCompany = yield tx.companyProfile.findUnique({
                        where: { companyName: data.companyName },
                    });
                    if (existingCompany && existingCompany.id !== companyProfile.id) {
                        throw new appError_1.DuplicateError("A company with this name already exists. Please choose another name.");
                    }
                    const updatedProfile = yield tx.companyProfile.update({
                        where: { id: companyProfile.id },
                        data: {
                            companyName: data.companyName,
                            description: data.description,
                            industry: data.industry,
                            website: data.website,
                            location: data.location,
                            numberOfEmployees: data.numberOfEmployees,
                        },
                    });
                    let hiringTeam = yield tx.hiringTeam.findFirst({
                        where: { companyProfileId: companyProfile.id },
                    });
                    if (data.teamMembers) {
                        if (!hiringTeam) {
                            // Create hiringTeam if it doesn't exist
                            hiringTeam = yield tx.hiringTeam.create({
                                data: { companyProfileId: companyProfile.id },
                            });
                        }
                        else {
                            // Delete existing team members
                            yield tx.teamMember.deleteMany({
                                where: { hiringTeamId: hiringTeam.id },
                            });
                        }
                        // Create new team members
                        for (const member of data.teamMembers) {
                            const existingUser = yield tx.user.findUnique({
                                where: { email: member.email },
                            });
                            yield tx.teamMember.create({
                                data: {
                                    hiringTeamId: hiringTeam.id,
                                    email: member.email,
                                    role: member.role || "recruiter",
                                    userId: (existingUser === null || existingUser === void 0 ? void 0 : existingUser.id) || null,
                                },
                            });
                        }
                    }
                    return {
                        companyProfileId: updatedProfile.id,
                        companyName: updatedProfile.companyName,
                        hiringTeamId: (hiringTeam === null || hiringTeam === void 0 ? void 0 : hiringTeam.id) || null,
                    };
                }), {
                    timeout: 15000,
                });
                return result;
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    if (error.code === "P2025") {
                        throw new appError_1.NotFoundError("Record not found in the database.");
                    }
                    throw new appError_1.InternalServerError(`Database error: ${error.message}`);
                }
                throw error;
            }
        });
    }
    deleteCompanyTeam(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const companyProfile = yield tx.companyProfile.findFirst({
                        where: { userId },
                    });
                    if (!companyProfile) {
                        throw new Error("No company profile found for this user.");
                    }
                    // Delete team members
                    const hiringTeam = yield tx.hiringTeam.findFirst({
                        where: { companyProfileId: companyProfile.id },
                    });
                    if (hiringTeam) {
                        yield tx.teamMember.deleteMany({
                            where: { hiringTeamId: hiringTeam.id },
                        });
                        yield tx.hiringTeam.delete({ where: { id: hiringTeam.id } });
                    }
                    // Delete company profile
                    yield tx.companyProfile.delete({ where: { id: companyProfile.id } });
                    return { message: "Company team deleted successfully" };
                }), {
                    timeout: 15000,
                });
                return result;
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    throw new Error(`Database error: ${error.message}`);
                }
                throw error;
            }
        });
    }
}
exports.CompanyTeamService = CompanyTeamService;
