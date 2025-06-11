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
exports.sendVerificationEmail = exports.sendResetEmail = void 0;
const sendResetEmail = (email, resetToken) => __awaiter(void 0, void 0, void 0, function* () {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    // Replace with actual email logic
    console.log(`Send email to ${email} with link: ${resetLink}`);
});
exports.sendResetEmail = sendResetEmail;
const sendVerificationEmail = (email, verificationToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    // Replace with actual email logic
    console.log(`Send email to ${email} with link: ${verificationLink}`);
});
exports.sendVerificationEmail = sendVerificationEmail;
