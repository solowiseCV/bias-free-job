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
exports.SearchJobSeekerService = void 0;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
class SearchJobSeekerService {
    static searchJobSeekers(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { role, skill, experienceLevel, workMode, jobType, industry, hasDisability, } = filters;
            return yield prisma.jobSeeker.findMany({
                where: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (role && { interestedRoles: { has: role } })), (skill && { skills: { has: skill } })), (experienceLevel && { experienceLevel })), (workMode && { workMode })), (jobType && { jobType })), (industry && { industry })), (hasDisability !== undefined && {
                    hasDisability: hasDisability === "true",
                })),
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            lastname: true,
                            firstname: true,
                            avatar: true,
                        },
                    },
                },
            });
        });
    }
}
exports.SearchJobSeekerService = SearchJobSeekerService;
