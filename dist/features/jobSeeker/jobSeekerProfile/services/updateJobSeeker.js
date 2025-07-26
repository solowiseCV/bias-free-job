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
exports.UpdateJobSeekerService = void 0;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
class UpdateJobSeekerService {
    static updateSeeker(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const jobSeeker = yield prisma.jobSeeker.update({
                where: { id },
                data: Object.assign(Object.assign({}, data), { updatedAt: new Date() }),
            });
            const fields = [
                { value: jobSeeker.bio, weight: 1 },
                { value: jobSeeker.location, weight: 1 },
                { value: jobSeeker.hasDisability !== null, weight: 1 },
                { value: (_a = jobSeeker.interestedRoles) === null || _a === void 0 ? void 0 : _a.length, weight: 1 },
                { value: jobSeeker.experienceLevel, weight: 1 },
                { value: jobSeeker.workMode, weight: 1 },
                { value: jobSeeker.jobType, weight: 1 },
                { value: (_b = jobSeeker.skills) === null || _b === void 0 ? void 0 : _b.length, weight: 1 },
                { value: jobSeeker.industry, weight: 1 },
                { value: (_c = jobSeeker.experience) === null || _c === void 0 ? void 0 : _c.length, weight: 1 },
                { value: (_d = jobSeeker.education) === null || _d === void 0 ? void 0 : _d.length, weight: 1 },
                { value: (_e = jobSeeker.certifications) === null || _e === void 0 ? void 0 : _e.length, weight: 1 },
                { value: (_f = jobSeeker.portfolio) === null || _f === void 0 ? void 0 : _f.length, weight: 1 },
                { value: jobSeeker.resume, weight: 1 },
                { value: (_g = jobSeeker.interests) === null || _g === void 0 ? void 0 : _g.length, weight: 1 },
            ];
            const totalWeight = fields.reduce((acc, f) => acc + f.weight, 0);
            const earnedWeight = fields.reduce((acc, field) => acc + (field.value ? field.weight : 0), 0);
            const percentage = parseFloat(((earnedWeight / totalWeight) * 100).toFixed(2));
            return yield prisma.jobSeeker.update({
                where: { id },
                data: { profileCompletion: percentage },
            });
        });
    }
}
exports.UpdateJobSeekerService = UpdateJobSeekerService;
