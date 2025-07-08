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
const mail_1 = require("../../../utils/mail");
const nodemailer_1 = require("../../../utils/nodemailer");
const prisma = new client_1.PrismaClient();
class CompanyTeamService {
    createCompanyTeam(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
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
            yield Promise.all(result.teamMembers.map((member) => __awaiter(this, void 0, void 0, function* () {
                const isExistingUser = yield prisma.user.findUnique({
                    where: { email: member.email },
                });
                const mailOptions = yield (0, mail_1.hiringTeamMailOptionSendEmail)(member.email, result.companyName, !!isExistingUser);
                yield nodemailer_1.transporter.sendMail(mailOptions);
            })));
            return {
                companyProfileId: result.companyProfileId,
                hiringTeamId: result.hiringTeamId,
            };
        });
    }
    getCompanyTeam(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.companyProfile.findUnique({
                where: { userId },
            });
        });
    }
}
exports.CompanyTeamService = CompanyTeamService;
