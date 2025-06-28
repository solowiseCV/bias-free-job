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
const client_1 = require("@prisma/client");
const mail_1 = require("../../../../utils/mail");
const nodemailer_1 = require("../../../../utils/nodemailer");
const prisma = new client_1.PrismaClient();
class CompanyTeamService {
    createCompanyTeam(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    // Check for existing company profile with the same userId
                    const existingProfile = yield tx.companyProfile.findFirst({ where: { userId } });
                    if (existingProfile) {
                        throw new Error('A company profile already exists for this user.');
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
                    yield tx.teamMember.createMany({
                        data: data.teamMembers.map((member) => ({
                            hiringTeamId: hiringTeam.id,
                            email: member.email,
                            role: member.role,
                        })),
                    });
                    return {
                        companyProfileId: companyProfile.id,
                        hiringTeamId: hiringTeam.id,
                        teamMembers: data.teamMembers,
                        companyName: data.companyName,
                    };
                }), {
                    timeout: 15000,
                });
                // Send emails after transaction success
                yield Promise.all(result.teamMembers.map((member) => __awaiter(this, void 0, void 0, function* () {
                    const isExistingUser = yield prisma.user.findUnique({ where: { email: member.email } });
                    const mailOptions = yield (0, mail_1.hiringTeamMailOptionSendEmail)(member.email, result.companyName, !!isExistingUser);
                    yield nodemailer_1.transporter.sendMail(mailOptions);
                })));
                return {
                    companyProfileId: result.companyProfileId,
                    hiringTeamId: result.hiringTeamId,
                };
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    if (error.code === 'P2002') {
                        throw new Error('A company profile with this user ID already exists. Please use a different user or update the existing profile.');
                    }
                    throw new Error(`Database error: ${error.message}`);
                }
                throw error;
            }
        });
    }
    // async getCompanyTeam(userId: string) {
    //   try {
    //     const companyProfile = await prisma.companyProfile.findFirst({
    //       where: { userId },
    //       include: {
    //         hiringTeams: {
    //           include: {
    //             teamMembers: true,
    //           },
    //         },
    //       },
    //     });
    //     if (!companyProfile) {
    //       throw new Error('No company profile found for this user.');
    //     }
    //  return {
    //     companyProfileId: companyProfile.id,
    //     companyName: companyProfile.companyName,
    //     description: companyProfile.description,
    //     industry: companyProfile.industry,
    //     website: companyProfile.website,
    //     location: companyProfile.location,
    //     numberOfEmployees: companyProfile.numberOfEmployees,
    //     hiringTeamId: companyProfile.hiringTeam?.id,
    //     teamMembers: companyProfile.hiringTeam?.teamMembers || [],
    //   };
    //   } catch (error) {
    //     if (error instanceof Error) {
    //       throw new Error(`Failed to fetch company team: ${error.message}`);
    //     }
    //     throw new Error('Unexpected error while fetching company team.');
    //   }
    // }
    updateCompanyTeam(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const companyProfile = yield tx.companyProfile.findFirst({ where: { userId } });
                    if (!companyProfile) {
                        throw new Error('No company profile found for this user.');
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
                    const hiringTeam = yield tx.hiringTeam.findFirst({ where: { companyProfileId: companyProfile.id } });
                    if (hiringTeam && data.teamMembers) {
                        // Delete existing team members
                        yield tx.teamMember.deleteMany({ where: { hiringTeamId: hiringTeam.id } });
                        // Create new team members
                        yield tx.teamMember.createMany({
                            data: data.teamMembers.map((member) => ({
                                hiringTeamId: hiringTeam.id,
                                email: member.email,
                                role: member.role,
                            })),
                        });
                    }
                    return {
                        companyProfileId: updatedProfile.id,
                        companyName: updatedProfile.companyName,
                    };
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
    deleteCompanyTeam(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const companyProfile = yield tx.companyProfile.findFirst({ where: { userId } });
                    if (!companyProfile) {
                        throw new Error('No company profile found for this user.');
                    }
                    // Delete team members
                    const hiringTeam = yield tx.hiringTeam.findFirst({ where: { companyProfileId: companyProfile.id } });
                    if (hiringTeam) {
                        yield tx.teamMember.deleteMany({ where: { hiringTeamId: hiringTeam.id } });
                        yield tx.hiringTeam.delete({ where: { id: hiringTeam.id } });
                    }
                    // Delete company profile
                    yield tx.companyProfile.delete({ where: { id: companyProfile.id } });
                    return { message: 'Company team deleted successfully' };
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
