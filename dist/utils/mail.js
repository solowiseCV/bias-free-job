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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// You can use any SMTP provider (Gmail, Mailtrap, SendGrid, etc.)
const transporter = nodemailer_1.default.createTransport({
    service: "gmail", // or use `host`, `port`, `secure`, etc. for custom SMTP
    auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASSWORD, // your email app password (not your actual password!)
    },
});
const sendMail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: `"Your App Name" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    };
    return transporter.sendMail(mailOptions);
});
exports.sendMail = sendMail;
