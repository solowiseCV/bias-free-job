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
exports.UserController = void 0;
const service_1 = require("./service");
const user_validation_1 = require("../../validations/user.validation");
const response_util_1 = __importDefault(require("../../utils/helpers/response.util"));
class UserController {
    static getUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationResult = user_validation_1.userIdSchema.safeParse(req.params);
                if (!validationResult.success) {
                    new response_util_1.default(400, false, "Invalid user ID", res, validationResult.error);
                    return;
                }
                const { userId } = validationResult.data;
                const user = yield service_1.UserService.getUserDetails(userId);
                if (!user) {
                    new response_util_1.default(404, false, "User not found", res);
                    return;
                }
                new response_util_1.default(200, true, "User details retrieved successfully", res, user);
            }
            catch (error) {
                new response_util_1.default(500, false, "Internal server error", res, error instanceof Error ? error.message : "Unknown error");
            }
        });
    }
    // Get all users with pagination
    static getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationResult = user_validation_1.paginationSchema.safeParse(req.query);
                if (!validationResult.success) {
                    new response_util_1.default(400, false, "Invalid pagination parameters", res, validationResult.error);
                    return;
                }
                const { page, limit } = validationResult.data;
                const result = yield service_1.UserService.getAllUsers(page, limit);
                new response_util_1.default(200, true, "All users retrieved successfully", res, result);
            }
            catch (error) {
                new response_util_1.default(500, false, "Internal server error", res, error instanceof Error ? error.message : "Unknown error");
            }
        });
    }
    // Update user details
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userIdValidation = user_validation_1.userIdSchema.safeParse(req.params);
                if (!userIdValidation.success) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid user ID",
                        errors: userIdValidation.error,
                    });
                    return;
                }
                const { userId } = userIdValidation.data;
                // Validate request body
                const validationResult = user_validation_1.updateUserSchema.safeParse(req.body);
                if (!validationResult.success) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid request data",
                        errors: validationResult.error,
                    });
                    return;
                }
                const updateData = validationResult.data;
                // Check if at least one field is provided for update or if a file is uploaded
                if (Object.keys(updateData).length === 0 && !req.file) {
                    res.status(400).json({
                        success: false,
                        message: "At least one field must be provided for update or a file must be uploaded",
                    });
                    return;
                }
                const updatedUser = yield service_1.UserService.updateUser(userId, updateData, req.file);
                res.status(200).json({
                    success: true,
                    message: "User updated successfully",
                    data: updatedUser,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "User not found") {
                        res.status(404).json({
                            success: false,
                            message: error.message,
                        });
                        return;
                    }
                    if (error.message === "Email already exists") {
                        res.status(409).json({
                            success: false,
                            message: error.message,
                        });
                        return;
                    }
                }
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    // Delete user
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationResult = user_validation_1.userIdSchema.safeParse(req.params);
                if (!validationResult.success) {
                    new response_util_1.default(400, false, "Invalid user ID", res, validationResult.error);
                    return;
                }
                const { userId } = validationResult.data;
                yield service_1.UserService.deleteUser(userId);
                new response_util_1.default(200, true, "User deleted successfully", res);
            }
            catch (error) {
                if (error instanceof Error && error.message === "User not found") {
                    new response_util_1.default(404, false, error.message, res);
                    return;
                }
                new response_util_1.default(500, false, "Internal server error", res, error instanceof Error ? error.message : "Unknown error");
            }
        });
    }
    // Get current user details (from authenticated user)
    static getCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                if (!userId) {
                    new response_util_1.default(401, false, "User not authenticated", res);
                    return;
                }
                const user = yield service_1.UserService.getUserDetails(userId);
                if (!user) {
                    new response_util_1.default(404, false, "User not found", res);
                    return;
                }
                new response_util_1.default(200, true, "Current user details retrieved successfully", res, user);
            }
            catch (error) {
                new response_util_1.default(500, false, "Internal server error", res, error instanceof Error ? error.message : "Unknown error");
            }
        });
    }
}
exports.UserController = UserController;
