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
exports.ForgotPasswordService = void 0;
const appError_1 = require("../../../lib/appError");
const client_1 = require("@prisma/client");
const mail_1 = require("../../../utils/mail");
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
class ForgotPasswordService {
    static forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw new appError_1.BadRequestError("Email is required");
            const user = yield prisma.user.findUnique({
                where: { email: email.toLowerCase() },
            });
            if (!user)
                throw new appError_1.NotFoundError("User not found");
            const resetToken = crypto_1.default.randomBytes(32).toString("hex");
            const resetTokenHash = yield bcryptjs_1.default.hash(resetToken, 10);
            const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
            yield prisma.user.update({
                where: { email },
                data: { resetToken: resetTokenHash, resetTokenExpires },
            });
            const resetLink = `${process.env.FRONTEND_BASE_URL}/reset-password?token=${resetToken}`;
            const emailTemplate = `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`;
            yield (0, mail_1.sendEmail)({
                email: user.email,
                subject: "Reset Your Password",
                html: emailTemplate,
            });
            return { message: "Password reset link sent to your email" };
        });
    }
}
exports.ForgotPasswordService = ForgotPasswordService;
