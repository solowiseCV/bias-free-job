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
exports.SaveJobService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SaveJobService {
    // Create a saved job entry
    saveJob(userId, jobPostingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingSavedJob = yield prisma.savedJob.findUnique({
                where: {
                    userId_jobPostingId: {
                        userId,
                        jobPostingId,
                    },
                },
            });
            if (existingSavedJob) {
                throw new Error("Job already saved by this user");
            }
            // Create the saved job entry
            const savedJob = yield prisma.savedJob.create({
                data: {
                    userId,
                    jobPostingId,
                },
                include: {
                    jobPosting: true,
                },
            });
            return savedJob;
        });
    }
    // Get all saved jobs for a user
    getSavedJobs(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const savedJobs = yield prisma.savedJob.findMany({
                where: { userId },
                include: {
                    jobPosting: true,
                },
            });
            return savedJobs;
        });
    }
    // Delete a saved job entry
    deleteSavedJob(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.savedJob.delete({
                where: {
                    id,
                },
            });
        });
    }
    // Optional: Get a specific saved job by userId and jobPostingId
    getSavedJob(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const savedJob = yield prisma.savedJob.findUnique({
                where: {
                    id,
                },
                include: {
                    jobPosting: true,
                },
            });
            return savedJob;
        });
    }
}
exports.SaveJobService = SaveJobService;
exports.default = new SaveJobService();
