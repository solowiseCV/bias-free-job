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
exports.PasswordResetService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const appError_1 = require("../../../lib/appError");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PasswordResetService {
    static resetPassword(token, newPassword, confirmPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token || !newPassword || !confirmPassword)
                throw new appError_1.BadRequestError("All fields are required");
            if (newPassword !== confirmPassword)
                throw new appError_1.BadRequestError("Passwords do not match");
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                throw new appError_1.BadRequestError("Password must be at least 8 characters long, with an uppercase letter, a lowercase letter, a number, and a special character.");
            }
            const user = yield prisma.user.findFirst({
                where: { resetTokenExpires: { gte: new Date() } },
            });
            if (!user || !(yield bcryptjs_1.default.compare(token, user.resetToken))) {
                throw new appError_1.InvalidError("Invalid or expired token");
            }
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
            yield prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    resetToken: null,
                    resetTokenExpires: null,
                },
            });
            return { message: "Password reset successful" };
        });
    }
}
exports.PasswordResetService = PasswordResetService;
