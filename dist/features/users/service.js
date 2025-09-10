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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const cloudinary_1 = __importDefault(require("../../configs/cloudinary"));
const multer_1 = require("../../middlewares/multer");
const prisma = new client_1.PrismaClient();
const cloudinary = (0, cloudinary_1.default)();
class UserService {
    // Get user details by ID
    static getUserDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma.user.findUnique({
                    where: { id: userId },
                    select: {
                        id: true,
                        email: true,
                        firstname: true,
                        lastname: true,
                        avatar: true,
                        userType: true,
                        phone_number: true,
                        createdAt: true,
                        updatedAt: true,
                        twoFactorEnabled: true,
                    },
                });
                return user;
            }
            catch (error) {
                throw new Error(`Failed to get user details: ${error}`);
            }
        });
    }
    // Get all users with pagination
    static getAllUsers() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            try {
                const skip = (page - 1) * limit;
                const [users, total] = yield Promise.all([
                    prisma.user.findMany({
                        skip,
                        take: limit,
                        select: {
                            id: true,
                            email: true,
                            firstname: true,
                            lastname: true,
                            avatar: true,
                            userType: true,
                            createdAt: true,
                            updatedAt: true,
                            twoFactorEnabled: true,
                        },
                        orderBy: { createdAt: "desc" },
                    }),
                    prisma.user.count(),
                ]);
                return {
                    success: true,
                    message: "Users retrieved successfully",
                    data: {
                        users,
                        total,
                        page,
                        limit,
                    },
                };
            }
            catch (error) {
                throw new Error(`Failed to get users: ${error}`);
            }
        });
    }
    static allUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.user.findMany({
                    include: {
                        jobSeeker: true,
                    },
                });
            }
            catch (error) {
                throw new Error(`Failed to get users: ${error}`);
            }
        });
    }
    // Update user details
    static updateUser(userId, updateData, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if user exists
                const existingUser = yield prisma.user.findUnique({
                    where: { id: userId },
                });
                if (!existingUser) {
                    throw new Error("User not found");
                }
                // If email is being updated, check if it's already taken
                if (updateData.email && updateData.email !== existingUser.email) {
                    const emailExists = yield prisma.user.findUnique({
                        where: { email: updateData.email },
                    });
                    if (emailExists) {
                        throw new Error("Email already exists");
                    }
                }
                // Handle avatar upload if file is provided
                if (file) {
                    const fileData = {
                        originalname: file.originalname,
                        buffer: file.buffer,
                    };
                    const dataUri = (0, multer_1.getDataUri)(fileData);
                    const uploadResult = yield cloudinary.uploader.upload(dataUri.content, {
                        folder: "avatars",
                        resource_type: "image",
                    });
                    // Delete old avatar from Cloudinary if it exists and is a Cloudinary URL
                    if (existingUser.avatar &&
                        existingUser.avatar.includes("cloudinary.com")) {
                        const matches = existingUser.avatar.match(/\/v\d+\/([^\.\/]+)\./);
                        if (matches && matches[1]) {
                            const publicId = `avatars/${matches[1]}`;
                            try {
                                yield cloudinary.uploader.destroy(publicId);
                            }
                            catch (e) {
                                console.warn("Failed to delete old avatar from Cloudinary:", e);
                            }
                        }
                    }
                    // Add avatar URL to update data
                    updateData.avatar = uploadResult.secure_url;
                }
                const updatedUser = yield prisma.user.update({
                    where: { id: userId },
                    data: updateData,
                    select: {
                        id: true,
                        email: true,
                        firstname: true,
                        lastname: true,
                        avatar: true,
                        userType: true,
                        createdAt: true,
                        updatedAt: true,
                        twoFactorEnabled: true,
                    },
                });
                return updatedUser;
            }
            catch (error) {
                throw new Error(`Failed to update user: ${error}`);
            }
        });
    }
    // Delete user
    static deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if user exists
                const existingUser = yield prisma.user.findUnique({
                    where: { id: userId },
                });
                if (!existingUser) {
                    throw new Error("User not found");
                }
                // Delete user (this will cascade to related records due to Prisma relations)
                yield prisma.user.delete({
                    where: { id: userId },
                });
            }
            catch (error) {
                throw new Error(`Failed to delete user: ${error}`);
            }
        });
    }
    static getRecentActivities(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, limit = 10) {
            try {
                const jobSeeker = yield prisma.jobSeeker.findFirst({
                    where: { userId },
                    include: {
                        applications: {
                            include: {
                                jobPosting: {
                                    include: { companyProfile: true },
                                },
                            },
                            orderBy: { updatedAt: "desc" },
                            take: limit,
                        },
                        interviews: {
                            include: {
                                jobPosting: {
                                    include: { companyProfile: true },
                                },
                                companyProfile: true,
                            },
                            orderBy: { updatedAt: "desc" },
                            take: limit,
                        },
                    },
                });
                if (!jobSeeker) {
                    return [];
                }
                const activities = [];
                jobSeeker.applications.forEach((application) => {
                    var _a;
                    activities.push({
                        id: application.id,
                        type: "application",
                        title: application.jobPosting.jobTitle,
                        status: application.status,
                        createdAt: application.appliedAt,
                        updatedAt: application.updatedAt || application.appliedAt,
                        details: {
                            jobTitle: application.jobPosting.jobTitle,
                            companyName: (_a = application.jobPosting.companyProfile) === null || _a === void 0 ? void 0 : _a.companyName,
                            location: application.jobPosting.companyLocation,
                        },
                    });
                });
                jobSeeker.interviews.forEach((interview) => {
                    var _a;
                    activities.push({
                        id: interview.id,
                        type: "interview",
                        title: interview.jobPosting.jobTitle,
                        status: interview.status,
                        createdAt: interview.createdAt,
                        updatedAt: interview.updatedAt || interview.createdAt,
                        details: {
                            jobTitle: interview.jobPosting.jobTitle,
                            companyName: (_a = interview.jobPosting.companyProfile) === null || _a === void 0 ? void 0 : _a.companyName,
                            location: interview.location,
                            dateTime: interview.dateTime,
                            interviewType: interview.interviewType,
                            duration: interview.duration,
                        },
                    });
                });
                activities.sort((a, b) => {
                    const aTime = a.updatedAt.getTime();
                    const bTime = b.updatedAt.getTime();
                    return bTime - aTime; // Latest first
                });
                return activities.slice(0, limit);
            }
            catch (error) {
                console.error("Error fetching recent activities:", error);
                throw new Error("Failed to fetch recent activities");
            }
        });
    }
    // Get user by email
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma.user.findUnique({
                    where: { email },
                    select: {
                        id: true,
                        email: true,
                        firstname: true,
                        lastname: true,
                        avatar: true,
                        userType: true,
                        createdAt: true,
                        updatedAt: true,
                        twoFactorEnabled: true,
                    },
                });
                return user;
            }
            catch (error) {
                throw new Error(`Failed to get user by email: ${error}`);
            }
        });
    }
}
exports.UserService = UserService;
